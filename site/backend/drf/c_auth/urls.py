from django.urls import path
from .views import UserCreate, LoginView
from .views import UserProfileView
from .views import UserProfileUpdateView
from .views import LogoutView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='account-register'),
    path('login/', LoginView.as_view(), name='account-login'),  # Использовать LoginView
    path('userprofile/', UserProfileView.as_view(), name='user-profile'),
    path('userprofile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
