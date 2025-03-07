import win32com.client
from win32com.client import Dispatch
outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")


def sendMeeting():
  appt = outlook.CreateItem(1) # AppointmentItem
  appt.Start = "2023-05-04 23:10" # yyyy-MM-dd hh:mm
  appt.Subject = "Fake meeting"
  appt.Duration = 30 # In minutes (60 Minutes)
  appt.Location = "The bat cave"

  appt.Save()
  appt.Send()
sendMeeting()