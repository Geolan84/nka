import React, { useState, useEffect } from "react";

const SelectHeadModal = ({ isOpen, onClose, selectedHead, onSelectHead, appId}) => {
    const token = localStorage.getItem("token");
    const [fetchedHeads, setFetchedHeads] = useState([]);
    const [localSelectedHead, setLocalSelectedHead] = useState(selectedHead); // Local state to manage selectedHead

    useEffect(() => {
        const fetchHeads = async () => {
            try {
                const response = await fetch("http://localhost:8080/struct/heads", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const headData = await response.json();
                    setFetchedHeads(headData.heads);
                } else {
                    console.error("Ошибка при загрузке списка руководителей");
                }
            } catch (error) {
                console.error("Произошла ошибка при выполнении запроса:", error);
            }
        };
        fetchHeads();
    }, [token]);

    const downloadPDF = async () => {
        try {
            const url = `http://localhost:8080/apps/get_accepted_pdf?app_id=${appId}&head_id=${localSelectedHead}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Get the PDF file as a Blob
                const blob = await response.blob();

                // Define the filename for the downloaded file
                const filename = "отпуск.pdf";

                // Use the file-saver library to trigger the download
                if (window.saveAs) {
                    window.saveAs(blob, filename);
                } else {
                    // Use the native method if saveAs is not available
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }

                console.log("PDF downloaded");
                onClose();
            } else {
                console.error("Error while downloading PDF");
            }
        } catch (error) {
            console.error("Произошла ошибка при выполнении запроса:", error);
        }
    };

    const handleSelectHead = (value) => {
        setLocalSelectedHead(value);
        onSelectHead(value); // Pass the selected head back to the parent component
    };

    return (
        <div className="modal-overlay">
                    <div className="modal-head">
        <div className={`modal ${isOpen ? "open" : ""}`}>
            <div className="modal-content">
                <h2>Выберите руководителя:</h2>
                <select
                    value={localSelectedHead}
                    onChange={(e) => handleSelectHead(e.target.value)}
                    className="head-select"
                >
                    <option value="">-- Выберите руководителя --</option>
                    {fetchedHeads.map((head, index) => (
                        <option key={index} value={head.user_id}>
                            {head.full_name}
                        </option>
                    ))}
                </select>
                <div className="modal-buttons">
                    <button onClick={downloadPDF}>Скачать заявление</button>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default SelectHeadModal;
