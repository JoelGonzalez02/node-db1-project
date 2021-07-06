const express = require('express');
const db = require('../data/dbConfig');
const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
        .then(a => res.status(200).json({data: a}))
        .catch(err => res.status(500).json({errorMessage: 'There are no accounts to retrieve'}, err))
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db('accounts')
        .where('id', id)
        .then(account => res.status(200).json({data: account}))
        .catch(err => res.status(404).json({errorMessage: 'The account with the specifed ID does not exist'}, err))
})

router.post('/', (req, res) => {
    const accountInfo = req.body;

    db('accounts')
        .insert(accountInfo)
        .then(id => res.status(201).json({data: id[0]}))
        .catch(err => res.status(500).json({errorMessage: 'The account could not be created'}, err))
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updated = req.body;

    db('accounts')
        .where('id', id)
        .update(updated)
        .then(count => {
            if (count > 0) {
                res.status(200).json({data: count})
            } else {
                res.status(404).json({message: 'There is not account to update'})
            }  
        })
         .catch(err=> res.status(500).json({errorMessage: 'There was a problem with the database'}, err))
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const deletedAccount = await db('accounts')
        .where('id', id)
        .del()

        deletedAccount ? res.status(200).json(deletedAccount)
        : res.status(404).json({message: 'The account with the specified ID does not exist'})
})

module.exports = router;