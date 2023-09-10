from django.urls import path
from .views import TournamentCreateView, TournamentDetailView
from .views import ParticipantCreateView
from .views import ParticipantDeleteView
from .views import LatestTournamentView
from .views import LatestFourTournamentsView
from .views import ParticipantUpdateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Путь URL для создания турнира
    path('create/', TournamentCreateView.as_view(), name='tournament-create'),

    # Путь URL для получения деталей турнира по его идентификатору (pk)
    path('detail/<int:pk>/', TournamentDetailView.as_view(), name='tournament-detail'),

    # Путь URL для создания участника
    path('participant/', ParticipantCreateView.as_view(), name='participant-create'),

    # Путь URL для удаления участника
    path('participant/<int:participant_id>/tournament/<int:tournament_id>/', ParticipantDeleteView.as_view(), name='participant-delete'),

    path('latest/', LatestTournamentView.as_view(), name='latest-tournament'),

    path('four_latest/', LatestFourTournamentsView.as_view(), name='latest-four-tournament'),

    path('update/<int:tournament_id>/participants/<int:participant_id>/', ParticipantUpdateView.as_view(), name='participant-update'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
