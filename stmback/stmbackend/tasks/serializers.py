from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    last_updated_by_username = serializers.CharField(source="last_updated_by.username", read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'owner', 'created_at','owner_username','last_updated_by_username',
            'updated_at',]
        read_only_fields = ['owner', 'created_at','last_updated_by','updated_at']

