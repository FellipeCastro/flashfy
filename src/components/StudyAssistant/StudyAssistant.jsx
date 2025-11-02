import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoMdClose } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import styles from "./StudyAssistant.module.css";

const StudyAssistant = ({ isOpen, onClose, currentCard }) => {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // <-- Novo estado de erro
    const chatEndRef = useRef(null);

    // 1. Inicializa ou reseta o chat
    useEffect(() => {
        // Reseta tudo ao abrir ou trocar de card
        setMessages([]);
        setUserInput("");
        setIsLoading(false);
        setError(null);
        setChat(null);

        if (!isOpen || !currentCard) return;

        // --- CORREÇÃO PRINCIPAL: Verificação da Chave API ---
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("VITE_GEMINI_API_KEY não encontrada.");
            setError("Chave da API do Gemini não configurada. Verifique seu arquivo .env");
            return; // Para a execução se não houver chave
        }

        const { question, answer } = currentCard;
        const systemPrompt = `Você é um "Assistente de Estudo" amigável. Seu único trabalho é ajudar o usuário a entender um flashcard. 
        O usuário está vendo o card:
        PERGUNTA: "${question}"
        RESPOSTA: "${answer}"
        
        Responda APENAS sobre este card. Se o usuário perguntar sobre outra coisa, gentilmente o redirecione para o tópico do card.`;

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const newChat = model.startChat({
                systemInstruction: systemPrompt,
                history: [],
            });

            setChat(newChat); // <-- O Chat é criado!
            startConversation(newChat, question); // Inicia a conversa
        } catch (e) {
            console.error("Erro ao inicializar IA:", e);
            setError("Não foi possível inicializar o assistente de IA.");
        }
    }, [isOpen, currentCard]); // Depende do card e do estado de abertura

    // 2. Efeito para rolar para a última mensagem
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. Função para a IA dar a primeira saudação
    const startConversation = async (chatInstance, question) => {
        setIsLoading(true);
        try {
            // Envia uma mensagem inicial para "acordar" a IA
            const result = await chatInstance.sendMessage(
                `Olá! Estou pronto para ajudar com meu card sobre "${question}". O que você gostaria de saber? (Me explique melhor, simplifique a resposta, ou me dê um exemplo)`
            );
            const responseText = result.response.text();
            setMessages([{ role: "model", text: responseText }]);
        } catch (e) {
            console.error("Erro ao iniciar chat:", e);
            setError("Não foi possível iniciar o chat com a IA.");
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Função principal de envio de mensagem
    const sendMessage = async (messageText) => {
        if (!messageText.trim() || !chat || isLoading || error) return;

        setIsLoading(true);
        const userMessage = { role: "user", text: messageText };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const result = await chat.sendMessage(messageText);
            const responseText = result.response.text();
            const modelMessage = { role: "model", text: responseText };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (e) {
            console.error("Erro ao enviar mensagem no chat:", e);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    text: "Desculpe, não consegui processar sua solicitação no momento.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Handler para o formulário de chat
    const handleChatSubmit = (e) => {
        e.preventDefault();
        sendMessage(userInput);
        setUserInput(""); // Limpa o input após o envio
    };

    // Handler de fechamento (com reset)
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setMessages([]);
            setChat(null);
            setError(null);
        }, 300);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className={styles.assistantBackdrop} onClick={handleClose}></div>
            <div className={styles.assistantSidebar}>
                <div className={styles.assistantHeader}>
                    <h3>
                        <BsStars /> Assistente de Estudo
                    </h3>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <IoMdClose />
                    </button>
                </div>

                <div className={styles.initialContext}>
                    <p>Estudando o card:</p>
                    <strong>{currentCard.question}</strong>
                </div>

                {/* Container principal do chat (com scroll) */}
                <div className={styles.chatContainer}>
                    {/* --- MUDANÇA: Renderiza o erro --- */}
                    {error && (
                        <div className={`${styles.chatMessage} ${styles.errorMessage}`}>
                            <p><strong>Erro:</strong> {error}</p>
                            <p>Verifique se você adicionou a `VITE_GEMINI_API_KEY` ao seu arquivo `.env` e reiniciou o servidor.</p>
                        </div>
                    )}

                    {/* Histórico de Mensagens */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.chatMessage} ${
                                msg.role === "user"
                                    ? styles.userMessage
                                    : styles.modelMessage
                            }`}
                        >
                            <p>{msg.text}</p>
                        </div>
                    ))}

                    {/* Indicador de "Digitando..." */}
                    {isLoading && (
                        <div
                            className={`${styles.chatMessage} ${styles.modelMessage}`}
                        >
                            <div className={styles.loadingDots}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    {/* Elemento âncora para o auto-scroll */}
                    <div ref={chatEndRef} />
                </div>

                {/* Formulário de Input (sempre no final) */}
                <form
                    onSubmit={handleChatSubmit}
                    className={styles.chatInputForm}
                >
                    <input
                        type="text"
                        className={styles.chatInput}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={
                            error 
                                ? "Assistente desabilitado" 
                                : "Pergunte algo sobre este card..."
                        }
                        // --- MUDANÇA: Lógica de 'disabled' atualizada ---
                        disabled={isLoading || !chat || error}
                    />
                    <button
                        type="submit"
                        className={styles.sendButton}
                        // --- MUDANÇA: Lógica de 'disabled' atualizada ---
                        disabled={isLoading || !chat || error || !userInput.trim()}
                    >
                        <FiSend />
                    </button>
                </form>
            </div>
        </>
    );
};

export default StudyAssistant;