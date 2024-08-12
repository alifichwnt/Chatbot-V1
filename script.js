document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const sendButton = document.getElementById("send-button"); // Gunakan ID yang sesuai
    const userInput = document.getElementById("user-input");
    const clearChatButton = document.getElementById("clear-chat");

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);  // Tambahkan kelas berdasarkan pengirim (user/bot)
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showLoading() {
        const loadingElement = document.createElement("div");
        loadingElement.classList.add("message", "bot", "loading");
        loadingElement.innerHTML = `
            <span></span><span></span><span></span>
        `;
        chatBox.appendChild(loadingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return loadingElement;
    }

    function removeLoading(loadingElement) {
        if (loadingElement) {
            chatBox.removeChild(loadingElement);
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();

        if (message === "") return;

        appendMessage("user", message);  // Tambahkan pesan pengguna ke chat box
        userInput.value = "";

        const loadingElement = showLoading();  // Tampilkan loading bubble

        try {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCfIXziF1qrqotGSuxP358x79Crh5ID5gY", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: {
                        parts: [
                            { text: message }
                        ]
                    },
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 1024
                    }
                })
            });

            if (!response.ok) {
                removeLoading(loadingElement);  // Hapus loading bubble
                appendMessage("bot", "Terjadi kesalahan, coba lagi.");
                return;
            }

            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text;
            removeLoading(loadingElement);  // Hapus loading bubble
            appendMessage("bot", botMessage);  // Tambahkan pesan bot ke chat box
        } catch (error) {
            removeLoading(loadingElement);  // Hapus loading bubble
            appendMessage("bot", "Terjadi kesalahan jaringan, coba lagi.");
        }
    }

    // Event listener untuk tombol "Kirim"
    sendButton.addEventListener("click", sendMessage); // Menggunakan ID yang sesuai

    // Memungkinkan pengiriman pesan dengan menekan tombol "Enter"
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Fungsi untuk menghapus semua pesan di chat box
    clearChatButton.addEventListener("click", () => {
        chatBox.innerHTML = "";  // Mengosongkan isi chat box
    });
});
