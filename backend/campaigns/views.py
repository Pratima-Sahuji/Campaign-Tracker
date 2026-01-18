import requests
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Campaign
from .serializers import CampaignSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer

    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
def dashboard_view(request):
    qs = Campaign.objects.filter(user=request.user)

    status_counts = qs.values("status").annotate(count=Count("id")).order_by("status")
    platform_counts = qs.values("platform").annotate(count=Count("id")).order_by("platform")

    total_budget = qs.aggregate(total=Sum("budget_inr"))["total"] or 0
    running_budget = qs.filter(status="running").aggregate(total=Sum("budget_inr"))["total"] or 0

    trends = (
        qs.annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    return Response({
        "status_counts": list(status_counts),
        "platform_counts": list(platform_counts),
        "total_budget": float(total_budget),
        "running_budget": float(running_budget),
        "trends": [{"day": str(x["day"]), "count": x["count"]} for x in trends],
    })


@api_view(["GET"])
def convert_currency(request):
    amount = request.GET.get("amount")
    if not amount:
        return Response({"error": "amount is required"}, status=400)

    try:
        amount = float(amount)
    except:
        return Response({"error": "amount must be a number"}, status=400)

    # Free API (no key)
    url = "https://open.er-api.com/v6/latest/INR"
    r = requests.get(url, timeout=10)
    data = r.json()

    if data.get("result") != "success":
        return Response({"error": "currency api failed", "raw": data}, status=502)

    usd_rate = data["rates"]["USD"]
    amount_usd = amount * usd_rate

    return Response({
        "amount_inr": amount,
        "usd_rate": usd_rate,
        "amount_usd": round(amount_usd, 2)
    })


# import requests
# from django.db.models import Count, Sum
# from django.db.models.functions import TruncDate
# from rest_framework import viewsets
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# from .models import Campaign
# from .serializers import CampaignSerializer

# class CampaignViewSet(viewsets.ModelViewSet):
#     queryset = Campaign.objects.all().order_by("-created_at")
#     serializer_class = CampaignSerializer


# @api_view(["GET"])
# def dashboard_view(request):
#     status_counts = Campaign.objects.values("status").annotate(count=Count("id")).order_by("status")
#     platform_counts = Campaign.objects.values("platform").annotate(count=Count("id")).order_by("platform")

#     total_budget = Campaign.objects.aggregate(total=Sum("budget_inr"))["total"] or 0
#     running_budget = Campaign.objects.filter(status="running").aggregate(total=Sum("budget_inr"))["total"] or 0

#     trends = (
#         Campaign.objects.annotate(day=TruncDate("created_at"))
#         .values("day")
#         .annotate(count=Count("id"))
#         .order_by("day")
#     )

#     return Response({
#         "status_counts": list(status_counts),
#         "platform_counts": list(platform_counts),
#         "total_budget": float(total_budget),
#         "running_budget": float(running_budget),
#         "trends": [{"day": str(x["day"]), "count": x["count"]} for x in trends],
#     })


# @api_view(["GET"])
# def convert_currency(request):
#     amount = request.GET.get("amount")
#     if not amount:
#         return Response({"error": "amount is required"}, status=400)

#     url = f"https://api.exchangerate.host/convert?from=INR&to=USD&amount={amount}"
#     r = requests.get(url, timeout=10)
#     data = r.json()

#     return Response({
#         "amount_inr": float(amount),
#         "amount_usd": data.get("result")
#     })
