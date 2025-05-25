import { useState } from "react";
import { Upload, Bot, MessageSquare, X, Loader2 } from "lucide-react";
import ChatbotResult from "./ChatbotResult";
import { trainChatbot } from "../api/chatbot";
const NewChatbot = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [chatbotData, setChatbotData] = useState({
        name: "",
        dataSource: "", // text, webpage, or document
        sourceContent: "",
        icon: "",
        iconImage: null,
        starterMessages: {},
        quickActions: {}, // optional flows and buttons
        theme: "light", // default theme
        descripcion: "",
        file: null
    });

    const defaultIcons = ["🤖", "💬", "💡", "🌟"];

    const handleDataSourceSelect = (source) => {
        setChatbotData(prev => ({ ...prev, dataSource: source }));
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle chatbot creation logic here
        try {
            setIsLoading(true);
            await trainChatbot({
                name: chatbotData.name,
                dataSource: chatbotData.dataSource,
                sourceContent: chatbotData.sourceContent,
                model: chatbotData.model,
                icon: chatbotData.icon,
                iconImage: chatbotData.iconImage,
                starterMessages: chatbotData.starterMessages,
                descripcion: chatbotData.descripcion,
                quickActions: chatbotData.quickActions,
                userId: 1,
                theme: chatbotData.theme,
                file: chatbotData.file
            });
            alert("Se ha creado con exito el chatbot")
            window.location.reload(); 

        } catch (err) {
            alert(err);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3/4 mx-auto p-6 max-h-[500px] overflow-y-scroll">
            <div className="flex flex-row justify-around max-h-10 mx-0 mb-4 ">
                <h1 className="text-2xl font-bold mb-6">Crear Nuevo Chatbot</h1>
                {/* Close the component */}
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to close? All progress will be lost.")) {
                            window.location.reload();
                        }
                    }}
                    className="top-4 right-4 p-2 bg-red-500 hover:bg-red-500/80 rounded-full flex flex-row items-center"
                    aria-label="Close"
                >

                    <X size={24} />
                </button>

            </div>
            {/* Select the type source of the content */}
            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Escoja el formato de la fuente de los datos
                        de entrenamiento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleDataSourceSelect("text")}
                            className="p-4 border rounded-lg hover:bg-secondary flex flex-col items-center gap-2"
                        >
                            <MessageSquare size={24} />
                            <span>Entrada de texto</span>
                        </button>
                        <button
                            onClick={() => handleDataSourceSelect("webpage")}
                            className="p-4 border rounded-lg hover:bg-secondary flex flex-col items-center gap-2"
                        >
                            <Bot size={24} />
                            <span>Pagina web</span>
                        </button>
                        <button
                            onClick={() => handleDataSourceSelect("document")}
                            className="p-4 border rounded-lg hover:bg-secondary flex flex-col items-center gap-2"
                        >
                            <Upload size={24} />
                            <span>Documento PDF</span>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex md:flex-row flex-col" >
                    <form onSubmit={handleSubmit} className="space-y-6 flex-1 max-w-[50%]">
                        <div>
                            <label className="block mb-2">Nombre de su chatbot</label>
                            <input
                                type="text"
                                value={chatbotData.name}
                                onChange={(e) => setChatbotData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border rounded bg-secondary"
                                required
                            />
                        </div>

                        {chatbotData.dataSource === "text" && (
                            <div>
                                <label className="block mb-2">Texto de entrenamiento</label>
                                <textarea
                                    value={chatbotData.sourceContent}
                                    onChange={(e) => setChatbotData(prev => ({ ...prev, sourceContent: e.target.value }))}
                                    className="w-full p-2 border rounded bg-secondary h-32"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-2 text-btn hover:text-btn/80 text-sm flex items-center gap-1"
                                >
                                    ← Cambiar fuente de datos
                                </button>
                            </div>
                        )}

                        {chatbotData.dataSource === "webpage" && (
                            <div>
                                <label className="block mb-2">URL de la pagina web</label>
                                <input
                                    type="url"
                                    value={chatbotData.sourceContent}
                                    onChange={(e) => setChatbotData(prev => ({ ...prev, sourceContent: e.target.value }))}
                                    className="w-full p-2 border rounded bg-secondary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-2 text-btn hover:text-btn/80 text-sm flex items-center gap-1"
                                >
                                    ← Change data source
                                </button>
                            </div>
                        )}

                        {chatbotData.dataSource === "document" && (
                            <div>
                                <label className="block mb-2">Cargar documento (PDF)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={(e) => setChatbotData(prev => ({ ...prev, file: e.target.files[0] }))}
                                    className="w-full p-2 border rounded bg-secondary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-2 text-btn hover:text-btn/80 text-sm flex items-center gap-1"
                                >
                                    ← Cambiar la fuente de los datos
                                </button>
                            </div>
                        )}
                        <div>
                            <label className="block mb-2">Escoger Icono</label>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    {defaultIcons.map((icon, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setChatbotData(prev => ({ ...prev, icon, customIcon: null }))}
                                            className={`text-2xl p-2 rounded ${chatbotData.icon === icon && !chatbotData.customIcon ? 'bg-btn' : 'bg-secondary'}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm">O carga tu propio icono (SVG)</label>
                                    <input
                                        type="file"
                                        accept=".svg,.png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const imageUrl = URL.createObjectURL(file);
                                                setChatbotData(prev => ({
                                                    ...prev,
                                                    icon: imageUrl,
                                                    customIcon: true,
                                                    iconImage: file
                                                }));
                                            }
                                        }}
                                        className="w-full p-2 border rounded bg-secondary text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Mensajes iniciales (Max 3)</label>
                            <div className="space-y-2">
                                {[0, 1, 2].map((index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Message ${index + 1}`}
                                        value={chatbotData.starterMessages[index] || ''}
                                        onChange={(e) => {
                                            const newMessages = { ...chatbotData.starterMessages };
                                            newMessages[index] = e.target.value;
                                            setChatbotData((prev) => ({ ...prev, starterMessages: newMessages }));
                                        }}
                                        className="w-full p-2 border rounded bg-secondary"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Acciones rápidas (Max 3)</label>
                            <div className="space-y-2">
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Action ${index + 1}`}
                                            value={chatbotData.quickActions[index] || ''}
                                            onChange={(e) => {
                                                const newIntents = { ...chatbotData.quickActions};
                                                newIntents[index] = e.target.value;
                                                setChatbotData(prev => ({ ...prev, quickActions: newIntents }));
                                            }}
                                            className="w-1/2 p-2 border rounded bg-secondary ring-0 focus:border-btn"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex p-2 gap-2">
                            <label htmlFor="theme" >Tema</label>
                            <select name="theme" id="theme" className="p-1 min-w-24 bg-secondary rounded"
                                onChange={(e) => {
                                    setChatbotData(prev => ({ ...prev, theme: e.target.value }))
                                }}
                            >
                                <option value="light">Claro</option>
                                <option value="dark">Oscuro</option>
                            </select>
                        </div>
                        
                        <div className="flex p-2 gap-2">
                            <label htmlFor="desc" >Descripción (max 250 caracteres)</label>
                            <textarea
                                    value={chatbotData.descripcion}
                                    onChange={(e) => setChatbotData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    className="w-full p-2 border rounded bg-secondary h-32"
                                    required
                                    id="desc"
                                    maxLength={250}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-btn text-txt px-4 py-2 rounded-lg hover:bg-btn/80 transition-colors"
                        >
                            Crear Chatbot {isLoading && (
                                <Loader2 className="mr-4"/>
                            )}
                        </button>
                    </form>
                    <div className="md:fixed md:right-6 md:top-32 w-[45%]">
                        <ChatbotResult chatbotConfig={{
                            botName: chatbotData.name || 'AI Assistant',
                            welcomeMessage: Object.values(chatbotData.starterMessages).filter((msg) => msg) || ['Hello! How can I help you today?'],
                            icon: chatbotData.icon,
                            quickActions: Object.values(chatbotData.quickActions).filter((intent) => intent) || ["Hello!"],
                            theme: chatbotData.theme,
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewChatbot;
