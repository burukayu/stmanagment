from rest_framework import generics, permissions
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwnerOrAdmin
from django.db.models import Q

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     # Staff & admin see all tasks, users only their own
    #     if user.is_staff or user.is_superuser:
    #         return Task.objects.all().order_by('-created_at')
    #     return Task.objects.filter(owner=user).order_by('-created_at')
    def get_queryset(self):
        user = self.request.user
        
        if user.is_superuser:  # Admin
            # All tasks except those created by other admins
            return Task.objects.exclude(owner__is_superuser=True).order_by('-updated_at')

        elif user.is_staff:  # Staff
            # Tasks created or updated by staff themselves
            # + All tasks created by normal users
            return Task.objects.filter(
                Q(owner=user) | Q(last_updated_by=user) | Q(owner__is_staff=False, owner__is_superuser=False)
            ).exclude(status__in=['completed']).order_by('-updated_at')

        else:  # Normal user
            # Only their tasks with status pending or redo
            return Task.objects.filter(
                owner=user,
                status__in=['pending', 'redo']
            ).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,last_updated_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def perform_update(self, serializer):
        serializer.save(last_updated_by=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # Force partial update even for PUT
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

        
    def update_priority(self, new_priority, user=None):
        """
        Update the task priority and optionally set last_updated_by.
        Raises ValueError if new_priority is not an integer.
        """
        try:
            new_priority = int(new_priority)
        except (TypeError, ValueError):
            raise ValueError("Priority must be an integer")

        self.priority = new_priority
        if user is not None:
            self.last_updated_by = user
        # call save() so updated_at (auto_now) is refreshed
        self.save()
        return self
# ...existing code...
    def __str__(self):
        return self.title