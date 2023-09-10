from rest_framework import serializers
from .models import Tournament, Participant
from django.contrib.auth.models import User
from .models import Participant

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ('user', 'tournament', 'try1', 'try2')

    def save(self, **kwargs):
        if self.instance is None:
            serializer = self.__class__(data=self.initial_data, context=self.context)
            serializer.is_valid(raise_exception=True)

            user = self.context['request'].user
            tournament = serializer.validated_data['tournament']

            existing_participant = Participant.objects.filter(user=user, tournament=tournament).first()
            if existing_participant:
                raise serializers.ValidationError('Участник уже существует.')

            if tournament.max_pilots is not None:
                current_participants = Participant.objects.filter(tournament=tournament).count()
                if current_participants >= tournament.max_pilots:
                    raise serializers.ValidationError('Превышено максимальное количество участников.')

            self.validated_data['user'] = user

        print(self.initial_data)  # Вывод данных перед сохранением
        print(self.validated_data)  # Вывод проверенных данных
        print(self.errors)  # Вывод ошибок валидации

        return super().save(**kwargs)

class TournamentSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True, read_only=True)
    is_full = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ('id',
                  'short_org_name',
                  'full_org_name',
                  'tournament_name',
                  'date',
                  'map',
                  'map_link',
                  'task',
                  'example',
                  'reglament',
                  'visual_reglament',
                  'max_pilots',
                  'owner',
                  'participants',
                  'is_full',
                  'image')

        extra_kwargs = {
            'max_pilots': {'allow_null': True, 'required': False},
        }

    def get_is_full(self, obj):
        if obj.max_pilots is not None:
            return Participant.objects.filter(tournament=obj).count() >= obj.max_pilots
        return False
    
    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("Изображение обязательно.")
        return value