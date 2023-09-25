from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage
from urllib.parse import urlparse

class PublicS3Storage(S3Boto3Storage):
    """Configuration for the Public bucket storage"""
    bucket_name = settings.AWS_PUBLIC_STORAGE_BUCKET_NAME
    default_acl = settings.AWS_PUBLIC_DEFAULT_ACL
    querystring_auth = False

    # For self hosted docker and minio
    if settings.DOCKERIZED and settings.USE_MINIO:
        custom_domain = f"{urlparse(settings.WEB_URL).netloc}/{bucket_name}"
        url_protocol = f"{urlparse(settings.WEB_URL).scheme}:"


class PrivateS3Storage(S3Boto3Storage):
    """Configuration for the Private bucket storage"""
    bucket_name = settings.AWS_PRIVATE_STORAGE_BUCKET_NAME
    region_name = settings.AWS_REGION_NAME
    addressing_style = settings.AWS_S3_ADDRESSING_STYLE
    default_acl = settings.AWS_PRIVATE_DEFAULT_ACL

    # For self hosted docker and minio
    if settings.DOCKERIZED and settings.USE_MINIO:
        custom_domain = f"{urlparse(settings.WEB_URL).netloc}/{bucket_name}"
        url_protocol = f"{urlparse(settings.WEB_URL).scheme}:"