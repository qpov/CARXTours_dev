from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament, Participant
from .serializers import TournamentSerializer, ParticipantSerializer
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import ValidationError

class TournamentCreateView(APIView):
    def post(self, request):
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            tournament = serializer.save(owner=request.user)
            response_data = {
                'id': tournament.id,
                'message': 'Турнир успешно создан.',
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        tournaments = Tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data)

class TournamentDetailView(APIView):
    def get_object(self, pk):
        try:
            return Tournament.objects.get(pk=pk)
        except Tournament.DoesNotExist:
            raise NotFound(detail="Турнир не найден")

    def get(self, request, pk):
        tournament = self.get_object(pk)
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data)

    def put(self, request, pk):
        tournament = self.get_object(pk)
        serializer = TournamentSerializer(tournament, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tournament = self.get_object(pk)
        tournament.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ParticipantCreateView(APIView):
    def post(self, request):
        serializer = ParticipantSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            tournament_id = serializer.validated_data['tournament']
            
            # Проверка наличие участника с таким же user_id и tournament_id
            existing_participant = Participant.objects.filter(user=request.user, tournament=tournament_id).first()

            if existing_participant:
                response_data = {
                    'error': 'Участник уже существует.',
                }
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

            participant = serializer.save(user=request.user)
            serialized_participant = ParticipantSerializer(participant)
            return Response(serialized_participant.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParticipantDeleteView(APIView):
    def get_object(self, participant_id, tournament_id):
        try:
            return Participant.objects.get(user_id=participant_id, tournament_id=tournament_id)
        except Participant.DoesNotExist:
            raise Http404

    def delete(self, request, participant_id, tournament_id, format=None):
        participant = self.get_object(participant_id, tournament_id)
        participant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class LatestTournamentView(APIView):
    def get(self, request):
        tournament = Tournament.objects.order_by('-id').first()
        if tournament is None:
            raise NotFound(detail="No tournaments available")
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data)

class LatestFourTournamentsView(APIView):
    def get(self, request):
        tournaments = Tournament.objects.order_by('-id')[:4]
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data)

class ParticipantUpdateView(APIView):
    def get_object(self, user_id, tournament_id):
        try:
            return Participant.objects.get(user_id=user_id, tournament_id=tournament_id)
        except Participant.DoesNotExist:
            raise Http404

    def put(self, request, participant_id, tournament_id, format=None):
        participant = self.get_object(participant_id, tournament_id)
        serializer = ParticipantSerializer(participant, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            raise ValidationError(serializer.errors)