"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('location', views.location, name="location"),
    path('grade', views.grade, name="grade"),
    path('cluster', views.cluster, name="cluster"),
    path('clusterNext', views.clusterNext, name="clusterNext"),
    path('kmeans', views.kmeans, name="kmeans"),
    path('join', views.join, name="join"),
    path('recommendation', views.recommendation, name="recommendation"),
    path('recommendation_default', views.recommendation_default, name="recommendation_default"),
    path('recommendation_submit', views.recommendation_submit, name="recommendation_submit"),
    path('ap', views.ap, name="ap"),
    path('getAprioriData', views.getAprioriData, name="getAprioriData"),
    path('network', views.network, name="network"),

]
