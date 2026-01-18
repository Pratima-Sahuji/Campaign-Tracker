from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CampaignViewSet, dashboard_view, convert_currency
from .auth_views import register

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet, basename="campaigns")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", dashboard_view),
    path("convert/", convert_currency),

    # ✅ Register
    path("auth/register/", register),
]
