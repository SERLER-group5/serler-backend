exports.getEvidenceRecords = (req, res) => {
    res.json({
        'evidenceRecords':[
            {'title': 'Agile - the good and bad'},
            {'title': 'React - Inside story'}
        ]
    });
}