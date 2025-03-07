import os
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename
import pandas as pd
from resume_parser import resumeparse
from resume_parser.resumeparse import *
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
from flask import (Flask, send_file, url_for, jsonify, render_template, send_from_directory)
import csv
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
UPLOAD_FOLDER = 'cv_upload/'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
extracted_data = []
head = ["email", "phone", "name", "total_exp", "address", "designition", "skills", "languages"]
def preprocess_text(text):
    # Convert float to string
    if isinstance(text, float):
        text = str(text)
    # Tokenize the text
    tokens = word_tokenize(text.lower())
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    # Join the tokens back into a string
    preprocessed_text = " ".join(tokens)
    return preprocessed_text

def extract_years_experience(job_description):
    years = 0
    if "years of experience" in job_description:
        start_index = job_description.find(":") + 2
        end_index = job_description.find("years of experience")
        years = int(job_description[start_index:end_index].strip().split("+")[0])
    return years

def calculate_experience_score(candidate_experience, required_experience):
    experience_gap = required_experience - candidate_experience
    if experience_gap <= 0:
        return 1
    else:
        return max(0, (1 - (experience_gap / required_experience)) )
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload')
def upload_file():
   return render_template('upload.html')

@app.route('/uploader', methods=['GET', 'POST'])
def uploader_file():
   extracted_data.clear() 
   if request.method == 'POST':
       # check if the post request has the file part
       if 'file' not in request.files:
           flash('No file part')
           return redirect(request.url)
       file = request.files['file']
       # If the user does not select a file, the browser submits an
       # empty file without a filename.
       if file.filename == '':
           flash('No selected file')
           return redirect(request.url)
       if file and allowed_file(file.filename):
           filename = secure_filename(file.filename)
           file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
           data = resumeparse.read_file('cv_upload/'+filename)
           extracted_data.append(data)
           
           #extracted_data.append( data)
           extension = filename.rsplit('.', 1)[1].lower()
           new_fname = extracted_data[0]['name'] + '.'+ extension
           print(new_fname)
           try:
               os.rename('cv_upload/'+filename,'cv_upload/'+new_fname)
           except:
               f"The URL /data is accessed directly. Try going to '/recommand' to submit the job discription"
               
           df = pd.DataFrame.from_dict(extracted_data) 
           df.to_csv (r'condidats.csv', index=False, header=False, mode='a')

           
           return jsonify(extracted_data[0])
        #    return 'file uploaded succesfully', filename

@app.route('/recommand')
def form():
    return render_template('my_form.html')





@app.route('/data/', methods = ['POST', 'GET'])
def data():
    # if request.method == 'GET':
    #     return f"The URL /data is accessed directly. Try going to '/recommand' to submit the job discription"
    if request.method == 'POST':
        form_data = request.form
        resumes_df = pd.read_csv('condidats.csv',encoding = "ISO-8859-1",dtype=str)
        
        # job_description = form_data.getlist('Job discription')[0]
        # nbr_of_profiles = form_data.get('nombre of profiles',type=int)
        if 'jobDescription' in form_data:
            job_description = form_data.getlist('jobDescription')[0]
        else:
            return "Error: Job description not found in form data"
        if 'nombreOfProfiles' in form_data:
            nbr_of_profiles = form_data.get('nombreOfProfiles', type=int)
        else:
            return "Error: Number of profiles not found in form data"
        print("nbr ",nbr_of_profiles)
        job_designition = resumeparse.job_designition(job_description)
        job_designition = preprocess_text( " ".join(job_designition))
        
        job_skills =  resumeparse.extract_skills(job_description)
        job_skills = preprocess_text(" ".join(job_skills))
        
        job_tot_exp = extract_years_experience(job_description)
        

        resumes_df["condidat_skills"]= resumes_df["skills"].apply(preprocess_text)
        
        resumes_df["condidat_designition"]= resumes_df["designition"].apply(preprocess_text)
        
        condidat_tot_exp = resumes_df["total_exp"].astype(int)
        vectorizer = TfidfVectorizer()
        vectorizer.fit([job_designition, job_skills])
        job_designation_vector = vectorizer.transform([job_designition])
        job_skills_vector = vectorizer.transform([job_skills]) 
        condidat_skills_vector = vectorizer.transform(resumes_df["condidat_skills"])
        condidat_designition_vector = vectorizer.transform(resumes_df["condidat_designition"])
        skills_cosine_similarities = cosine_similarity(job_skills_vector,condidat_skills_vector).flatten()
        designition_cosine_similarities = cosine_similarity(job_designation_vector,condidat_designition_vector).flatten()
        #resumes_df["skills_cosine_similarity_score"] = skills_cosine_similarities
        #resumes_df["skills_matching_score"] = resumes_df["skills_cosine_similarity_score"] * 100
        #resumes_df["designition_cosine_similarity_score"] = designition_cosine_similarities
        #resumes_df["designition_matching_score"] = resumes_df["designition_cosine_similarity_score"] * 100
        scores = condidat_tot_exp.apply(lambda x: calculate_experience_score(x, job_tot_exp))
        #resumes_df["tot_exp_score"] = tot_exp_score
        resumes_df["cosine_similarity_score"] = (skills_cosine_similarities + designition_cosine_similarities + scores)/3
        resumes_df["matching_score"] = resumes_df["cosine_similarity_score"] * 100
        # Sort the resumes DataFrame by the cosine similarity score in descending order
        sorted_resumes_df = resumes_df.sort_values(by="cosine_similarity_score", ascending=False)
        
        condidats_list = []
        skil = []
        condi_list = []
        company = []

        # Select the top 3 resumes with the highest cosine similarity scores
        top_resumes_df = sorted_resumes_df.head(nbr_of_profiles)
        con = top_resumes_df.to_dict()

        for index, row in top_resumes_df.iterrows():
            
            name = row['name']
            email = row['email']
            phone = row['phone']
            adress = row['address']
            
            skills = row['skills']
            skills = skills.replace("[","").replace("]","").replace("'","")
            
            skil.append(skills)
            #link_cv = 'cv_upload/'+ (row['name']) + '.pdf'
            
            match_percentage = round(row['matching_score'], 2)
            condidats_list.append(f"-  {name},{email}, {phone},{match_percentage}")
        for i in range(0,len(condidats_list)):
          

            pro = list((condidats_list[i]).split(","))
            skill = list(skil[i].split(','))
            #company = list(company[i].split(','))
            
            #pro.append(company)
            pro.append(skill)
            print(pro)
            pro_key = ['name','email', 'phone','score','cv_link','skills']
            pro_dict = dict(zip(pro_key, pro))
            condi_list.append(pro_dict)
        #profiles = ['profile1', 'profile2', 'profile3', 'profile4', 'profile5', 'profile6', 'profile7', 'profile8' ]
        #condidats =  dict(zip(profiles,condi_list))
        with open("data.json", "w") as outfile:
            json.dump(condi_list, outfile)
        
        #path = '1.pdf'
        #send_file(path, as_attachment=True)
        # return render_template('data.html',text = condi_list)
        return jsonify(condi_list)
    else :
        return jsonify({"error" : "error"})

@app.route('/view_cv/<path:filename>')
def view_cv(filename):
    print(filename)
    return send_file(filename, mimetype='application/pdf')

@app.route('/download/<path:filename>')
def download_cv(filename):
    print(filename)
    return send_file(filename, as_attachment=True)







app.run(host='localhost', port=5000)


