const express = require('express');
const router = express.Router();

const { Order } = require('../../models');

router.get('/:order_id', async (req, res) => {
    try {
        const order = await Order.where({
            'user_id': req.body.user_id,
        }).fetch({
            require: true,
            withRelated:['orderItem.product']
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;