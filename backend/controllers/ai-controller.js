const getAiData = (req, res) => {
    try {
        res.status(200).json({ message: "AI Data Endpoint" })
    } catch (error) {
        return res.status(500).json({ message: "AI NGADAT CUY -> Controller AI", error: error.message })
    }
}

export { getAiData }