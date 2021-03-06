const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pusher = require('pusher');
const keys = require('../keys');

const Vote = require('../models/vote');

var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: true
});

router.get('/', (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes: votes }));
});


router.post('/', (req, res) => {
   const newVote = {
    os: req.body.os,
    points: 1
   };
   
   
  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      os: vote.os
    });

    return res.json({ success: true, message: 'Thank you for voting' });

  });
});


module.exports = router;