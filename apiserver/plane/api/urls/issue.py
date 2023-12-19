from django.urls import path

from plane.api.views import (
    IssueAPIEndpoint,
    LabelAPIEndpoint,
    IssueLinkAPIEndpoint,
    IssueCommentAPIEndpoint,
    IssueActivityAPIEndpoint,
)

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/",
        IssueAPIEndpoint.as_view(),
        name="issue",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:pk>/",
        IssueAPIEndpoint.as_view(),
        name="issue",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/labels/",
        LabelAPIEndpoint.as_view(),
        name="label",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/labels/<uuid:pk>/",
        LabelAPIEndpoint.as_view(),
        name="label",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/links/",
        IssueLinkAPIEndpoint.as_view(),
        name="link",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/links/<uuid:pk>/",
        IssueLinkAPIEndpoint.as_view(),
        name="link",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/comments/",
        IssueCommentAPIEndpoint.as_view(),
        name="comment",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/comments/<uuid:pk>/",
        IssueCommentAPIEndpoint.as_view(),
        name="comment",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/activities/",
        IssueActivityAPIEndpoint.as_view(),
        name="activity",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/activities/<uuid:pk>/",
        IssueActivityAPIEndpoint.as_view(),
        name="activity",
    ),
    ## End Issue Drafts
]
