from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['status', 'short_org_name', 'full_org_name']  # updated

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'date_joined', 'userprofile']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        userprofile_data = validated_data.pop('userprofile', {})
        user = User.objects.create_user(**validated_data)
        if userprofile_data:
            UserProfile.objects.create(user=user, **userprofile_data)
        return user
