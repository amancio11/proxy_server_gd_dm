const postgresdbService = require('./connection');
const queryLibrary = require('./library');


module.exports.listenerSetup = (app) => {
    app.get("/db/getReasonsForVariance", async (req, res) => {
        try {
            const data = await postgresdbService.executeQuery(queryLibrary.getReasonsForVarianceQuery);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante l\'esecuzione della query.' });
        }
    });

    app.get("/db/getMarkingData", async (req, res) => {
        const { commessa, operation } = req.query;

        if (!commessa || !operation) {
            return res.status(400).json({ error: "I parametri 'commessa' e 'operation' sono obbligatori." });
        }

        try {
            const data = await postgresdbService.executeQuery(queryLibrary.getMarkingDataQuery, [commessa, operation]);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante l\'esecuzione della query.' });
        }
    }),

        app.post("/db/insertOpConfirmation", async (req, res) => {
            const {
                wbe_macchina,
                operation,
                mes_order,
                confirmation_number,
                marking_date,
                start_time,
                finish_time,
                reason_for_variance
            } = req.body;

            if (!wbe_macchina || !operation || !mes_order ||
                !confirmation_number || !marking_date || !start_time ||
                !finish_time || !reason_for_variance) {
                return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
            }

            try {
                await postgresdbService.executeQuery(queryLibrary.insertOpConfirmation, [
                    wbe_macchina,
                    operation,
                    mes_order,
                    confirmation_number,
                    marking_date,
                    start_time,
                    finish_time,
                    reason_for_variance
                ]);
                res.status(200).json({ message: "Dati inseriti con successo!" });
            } catch (error) {
                console.error("Errore durante l'inserimento:", error);
                res.status(500).json({ error: "Errore durante l'inserimento dei dati." });
            }
        }),

        app.get("/db/getZOrdersLinkByProjectParentOrderChildOrderFlag", async (req, res) => {
            const { project, parentOrder, childOrder, parentAssemblyFlag } = req.query;

            if (!project) {
                return res.status(400).json({ error: "Il parametro project è obbligatorio" });
            } else if (!parentOrder) {
                return res.status(400).json({ error: "Il parametro parentOrder è obbligatorio" });
            } else if (!childOrder) {
                return res.status(400).json({ error: "Il parametro childOrder è obbligatorio" });
            } else if (!!!parentAssemblyFlag) {
                return res.status(400).json({ error: "Il parametro parentAssemblyFlag è obbligatorio" });
            }

            try {
                const data = await postgresdbService.executeQuery(queryLibrary.getZOrdersLinkByProjectParentOrderChildOrderFlagQuery, [project, parentOrder, childOrder, parentAssemblyFlag]);
                res.json(data);
            } catch (error) {
                res.status(500).json({ error: 'Errore durante l\'esecuzione della query.' });
            }
        });
};

