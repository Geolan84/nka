from config import MAIL_KEY, EMAIL_SENDER
from .messages import MESSAGE_NEW_PASSWORD, MESSAGE_NEW_APPS, MESSAGE_UPDATED_APP
from email.mime.text import MIMEText
import smtplib
import ssl


class MailSender:
    SMTP_PORT = 587
    SERVER = "smtp.gmail.com"

    @staticmethod
    def __send_letter(email: str, theme: str, message_to_send: str):
        try:
            simple_email_context = ssl.create_default_context()

            msg = MIMEText(message_to_send, "html")
            msg["Subject"] = theme
        except Exception as e:
            print(e)
            return

        try:
            TIE_server = smtplib.SMTP(MailSender.SERVER, MailSender.SMTP_PORT)
            TIE_server.starttls(context=simple_email_context)
            TIE_server.login(EMAIL_SENDER, MAIL_KEY)
            TIE_server.sendmail(EMAIL_SENDER, email, msg.as_string())
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            TIE_server.quit()

    @staticmethod
    def send_status_updated(email: str, link: str, receiver: str):
        return MailSender.__send_letter(
            email,
            "Новые отпуска для согласования",
            MESSAGE_UPDATED_APP.format(link=link, receiver=receiver),
        )

    @staticmethod
    def send_new_apps_notification(email: str, name: str, link: str, receiver: str):
        return MailSender.__send_letter(
            email,
            "Новые отпуска для согласования",
            MESSAGE_NEW_APPS.format(name=name, link=link, receiver=receiver),
        )

    # @staticmethod
    # def send_recover_link(email: str, token: str) -> bool:
    #     return MailSender.__send_letter(email, MESSAGE_RESET.format(f"http://localhost:8080/auth/recover?link={token}"))

    def send_new_password(email: str, new_password: str) -> bool:
        return MailSender.__send_letter(
            email, MESSAGE_NEW_PASSWORD.format(new_password)
        )
