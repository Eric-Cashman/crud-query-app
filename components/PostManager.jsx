import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "https://jsonplaceholder.typicode.com";

const showAlert = (title, message) => {
  window.alert(`${title}\n\n${message}`);
};

const showConfirm = (title, message) => {
  return window.confirm(`${title}\n\n${message}`);
};

export default function PostManager() {
  const queryClient = useQueryClient();

  const [filterUserId, setFilterUserId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [patchId, setPatchId] = useState("");
  const [patchTitle, setPatchTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const showStatus = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const { data: posts, isPending, isError } = useQuery({
    queryKey: ["posts", filterUserId],
    queryFn: async () => {
      const url = filterUserId
        ? `${BASE_URL}/posts?userId=${filterUserId}`
        : `${BASE_URL}/posts`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    }
  });

  const createPost = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: (data) => {
      showStatus(`✅ Post created successfully with ID: ${data.id}`);
      setNewTitle("");
      setNewBody("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      showStatus("❌ Failed to create post");
    }
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, title, body }) => {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 })
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    },
    onSuccess: () => {
      showStatus("✅ Post updated successfully!");
      setEditingPost(null);
      setEditTitle("");
      setEditBody("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      showStatus("❌ Failed to update post");
    }
  });

  const patchPost = useMutation({
    mutationFn: async ({ id, title }) => {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error("Failed to patch post");
      return response.json();
    },
    onSuccess: (data) => {
      showStatus(`✅ Title patched to: "${data.title}"`);
      setPatchId("");
      setPatchTitle("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      showStatus("❌ Failed to patch post");
    }
  });

  const deletePost = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete post");
      return response.json();
    },
    onSuccess: () => {
      showStatus("✅ Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      showStatus("❌ Failed to delete post");
    }
  });

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const confirmed = showConfirm(
      "Delete Post",
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      deletePost.mutate(id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📝 Blog Post Manager</Text>

      {statusMessage !== "" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter by User ID</Text>
        <TextInput
          style={styles.input}
          value={filterUserId}
          onChangeText={setFilterUserId}
          placeholder="Enter User ID (1-10)"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => setFilterUserId("")}
        >
          <Text style={styles.btnText}>Clear Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create New Post</Text>
        <TextInput
          style={styles.input}
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="Post title"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={newBody}
          onChangeText={setNewBody}
          placeholder="Post body"
          multiline
        />
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => {
            if (!newTitle || !newBody) {
              showStatus("❌ Please fill in both title and body");
              return;
            }
            createPost.mutate({ title: newTitle, body: newBody, userId: 1 });
          }}
        >
          <Text style={styles.btnText}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patch Post Title Only</Text>
        <TextInput
          style={styles.input}
          value={patchId}
          onChangeText={setPatchId}
          placeholder="Post ID to patch"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={patchTitle}
          onChangeText={setPatchTitle}
          placeholder="New title"
        />
        <TouchableOpacity
          style={styles.btnWarning}
          onPress={() => {
            if (!patchId || !patchTitle) {
              showStatus("❌ Please enter both ID and new title");
              return;
            }
            patchPost.mutate({ id: patchId, title: patchTitle });
          }}
        >
          <Text style={styles.btnText}>
            {patchPost.isPending ? "Patching..." : "Patch Title"}
          </Text>
        </TouchableOpacity>
      </View>

      {editingPost && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Editing Post #{editingPost.id}
          </Text>
          <TextInput
            style={styles.input}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Updated title"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editBody}
            onChangeText={setEditBody}
            placeholder="Updated body"
            multiline
          />
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() =>
              updatePost.mutate({
                id: editingPost.id,
                title: editTitle,
                body: editBody
              })
            }
          >
            <Text style={styles.btnText}>
              {updatePost.isPending ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setEditingPost(null)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Posts {filterUserId ? `(User ${filterUserId})` : "(All)"}
        </Text>

        {isPending && (
          <Text style={styles.statusMsg}>🔄 Loading posts...</Text>
        )}
        {isError && (
          <Text style={styles.errorMsg}>❌ Error loading posts!</Text>
        )}

        {posts?.slice(0, 20).map(post => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postId}>Post #{post.id}</Text>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>
              {post.body}
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEdit(post)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(post.id)}
              >
                <Text style={styles.btnText}>
                  {deletePost.isPending ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
    color: "#1a1a2e"
  },
  statusBanner: {
    backgroundColor: "#1a1a2e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center"
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1a1a2e"
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e4e7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9"
  },
  textArea: {
    height: 80,
    textAlignVertical: "top"
  },
  btnPrimary: {
    backgroundColor: "#646cff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8
  },
  btnSecondary: {
    backgroundColor: "#888",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8
  },
  btnWarning: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  statusMsg: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    padding: 20
  },
  errorMsg: {
    textAlign: "center",
    color: "#ff3b3b",
    fontSize: 16,
    padding: 20
  },
  postCard: {
    borderWidth: 1,
    borderColor: "#e5e4e7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9"
  },
  postId: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 6,
    textTransform: "capitalize"
  },
  postBody: {
    fontSize: 14,
    color: "#6b6375",
    marginBottom: 10
  },
  postActions: {
    flexDirection: "row",
    gap: 8
  },
  editBtn: {
    backgroundColor: "#646cff",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: "center"
  },
  deleteBtn: {
    backgroundColor: "#ff3b3b",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: "center"
  }
});