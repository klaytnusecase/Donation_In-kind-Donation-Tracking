## Description

This pilot project is for tracking "donation box" that has various goods, such as toothpaste, soap, and snack, in a unit. Goods are donated by any organizations (= members), and packed in donation boxes by a nonprofit foundation (= foundation), and distributed to local welfare centers (= recipients). Each donation box has a unique identification number that allows recipients to record its status into the Klaytn, especially when a good is arrived at recipients and where it is finally given. Through the identification numbers, not only members but also the foundation can retrieve the information of goods and boxes when they want. 

**Our codes are at a preliminary stage with a focus on the following procedure and smart contract methods.**

## Flows & Methods

We record donation information into a local database or the Klaytn as there are privacy issues in blockchain-based donation.

1. [Klaytn & Local] Members donate goods and give in-depth information (quantity, price, expiration date, ...) to the foundation.
    - Members specify which information will be opened to the public
    - The selected information are recorded into the Klaytn (method: *donate*)
    - Information what members are reluctant to open are stored into a local database (MySQL)
2. [Local] For each type of donation boxes, the foundation decides its components based on the collected goods.
    - e.g., type A box consists of 3 toothpastes and 1 toothbrush
    - Box configuration is saved into a local database
    
