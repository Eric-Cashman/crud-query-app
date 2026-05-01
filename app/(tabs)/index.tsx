import PostsManager from "@/components/PostManager";
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView>
      <PostsManager />
    </ScrollView>
  );
}