// Bad words filter utility for frontend
// Uses the `bad-words` package (npm install bad-words)

import Filter from 'bad-words';

const filter = new Filter();

// Custom profanity words for the store context
filter.addWords(
    'scam', 'fake', 'fraud', 'ripoff', 'garbage', 'trash', 'worst',
    'terrible', 'awful', 'horrible', 'pathetic', 'useless', 'junk',
    'crap', 'shit', 'fuck', 'damn', 'bitch', 'asshole', 'bastard'
);

export default filter;