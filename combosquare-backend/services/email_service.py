# services/email_service.py
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings

logger = logging.getLogger(__name__)


def send_contact_email(name: str, email: str, mobile: str, message: str) -> bool:
    """
    Send a contact form notification email to the company inbox.
    Uses Gmail SMTP with TLS and App Password authentication.
    Returns True on success, False on failure. Never raises.
    """
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured — skipping email.")
        return False

    subject = f"📩 New Contact Form Submission from {name}"

    body = (
        f"New contact form submission received:\n"
        f"\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Mobile:  {mobile if mobile else 'Not provided'}\n"
        f"\n"
        f"Message:\n"
        f"{message}\n"
    )

    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_USERNAME
    msg["To"] = settings.COMPANY_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)

        logger.info(f"✅ Email sent successfully for contact from {name} ({email})")
        return True

    except smtplib.SMTPAuthenticationError:
        logger.error("❌ SMTP authentication failed — check SMTP_USERNAME and SMTP_PASSWORD.")
        return False
    except smtplib.SMTPConnectError:
        logger.error("❌ Could not connect to SMTP server — check SMTP_SERVER and SMTP_PORT.")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to send email: {e}")
        return False