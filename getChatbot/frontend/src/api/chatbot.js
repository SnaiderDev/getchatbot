import api from './api';

export const trainChatbot = async ({
  name,
  dataSource,
  sourceContent,
  model,
  icon,
  iconImage,
  starterMessages,
  quickActions,
  descripcion,
  userId,
  theme,
  file,
}) => {
  const formData = new FormData();

  // Append all parameters to the formData
  formData.append('name', name);
  formData.append('data_source', dataSource);
  formData.append('model', model);
  formData.append('icon', icon);
  if (iconImage) {
    formData.append('icon_image', iconImage);
  }
  formData.append('starter_messages', JSON.stringify(starterMessages || {}));
  formData.append('quick_actions', JSON.stringify(quickActions || {}));
  formData.append('user_id', userId);
  formData.append('theme', theme);
  formData.append('descripcion', descripcion);
  formData.append('sourceContent', sourceContent);
  formData.append('document', file);

  // const token = localStorage.getItem("access_token");
  // if (!token) throw new Error("No access token found.");


  try {
    const response = await api.post('/chatbot/chatbot-train/', formData, {
      headers: {
        // "Authorization": `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error training chatbot:', error);
    throw error;
  }
};


  // Interact with Chatbot
  export const interactWithChatbot = async (message, chatbot_id) => {
    const payload = {
        message: message,
        chatbot_id: chatbot_id
    };

    try {
        const response = await api.post('/chatbot/chatbot-interact/', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error interacting with chatbot:', error);
        throw error;
    }
  };

   // get all Chatbot
  export const getAllChatbots = async () => {
    try {
      const response = await api.get('/chatbot/user-chatbots/');
      return response.data;
    } catch (error) {
      console.error('Error fetching chatbots:', error);
      throw error;
    }
  };

  // Get a specific Chatbot
  export const getSpecificChatbot = async (chatbotId) => {
    try {
      const response = await api.get(`/chatbot/get-specific-chatbot/?chatbot_id=${chatbotId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching specific chatbot:', error);
      throw error;
    }
  };

  // Delete a specific Chatbot
  export const deleteChatbot = async (chatbotId) => {
  try {
    const response = await api.delete(`chatbot/chatbot/${chatbotId}/delete/`, {
      headers: {
                'Content-Type': 'application/json',
            },
    });
    console.log("Chatbot eliminado correctamente");
    window.location.reload(); // Refresh the page to reflect changes
    // Optionally trigger refresh or state update
  } catch (error) {
    console.error("Error al eliminar el chatbot:", error.response?.data || error.message);
  }
};