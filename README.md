## Description

This pilot project is for tracking "donation box" that has various goods, such as toothpaste, soap, and snack, in a unit. Goods are donated by any organizations (= members), and packed in donation boxes by a nonprofit foundation (= foundation), and distributed to local welfare centers (= recipients). Each donation box has a unique identification number that allows recipients to record its status into the Klaytn, especially when a good is arrived at recipients and where it is finally given. In addition, through the identification numbers, not only the foundation but also members can retrieve the information of goods and boxes when they want. 

**Our codes are at a preliminary stage with a focus on the following procedure and smart contract methods.**

## Flows

We record donation information into a local database and/or the Klaytn as there are privacy issues in blockchain-based donation.

1. [Klaytn / Local] Members donate goods and give in-depth information (quantity, price, expiration date, ...) to the foundation.
    - Members specify which information will be opened to the public.
    - The selected information are recorded into the Klaytn. (method: __*donate*__)
    - Information what members are reluctant to open are stored into a local database. (MySQL)
    
2. [Local] For each type of donation boxes, the foundation decides its configuration based on the collected goods.
    - e.g., type A box consists of 3 toothpastes and 1 toothbrush while type B box only has 1 soap. 
    - Box configuration is saved into a local database. The foundation could change the configuration easily. 
    - Each type has own expiration date, which is the minimum of expiration dates of goods. 
    
3. [Local] The foundation sets the number of boxes by types.
    - The number of boxes is determined depending on the quantity of goods that members donate.
    - These numbers are stored in a local database. 
    
4. [Local] The foundation temporally distributes boxes to recipients.
    - This step needs for simulating a donation event before recording the box information into the Klaytn.
    - Temporal distributions are saved in a local database to be easily modified.
    
5. [Klaytn] The foundation uploads box distribution details to the Klaytn. 
    - Each box has an identification number and is sent to a recipient. (method: __*distributeBox*__)
    - A box contains rich information including the identification number, box type, recipient, expiration date, and etc.
    
6. [Klaytn] Recipients update box information when they receive boxes and deliver them to individuals.
    - Recipients record the date when they receive boxes by using their private key (method: __*receiveBox*__)
    - Recipients also record the date and details of final destinations (method: __*addInfo*__).
    - Private key is generated when the foundation creates ID of a recipient.
    - Keystore files are in the system, so that recipients do not need to load them independently when signing a transaction.
    - Recipients delegate smart contract execution to the foundation. The foundation pays gas. 
    
![GitHub Logo](/public/Fig_for_flow_ENG.png)


## Prerequisites


1. [NPM](https://www.npmjs.com/) and Node installed (node version 8.10.0)

2. Follow the [Klaytn quick start](https://docs.klaytn.com/getting_started/quick_start) for work with klaytn

3. Install mysql for local storage.



## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version.

```shell
$ git clone https://github.com/[[git-hub address]] MyApp
$ cd MyApp
```

#### 2. Run `yarn install`

This command install run-time project depedencies and developter tools that listed in [package.json](../package.json) file.
If you add nother libraries and add to [package.json](../package.json), you must re-install with `yarn install`.


#### 3. Run `mysql -u [user_name] -p < nodejs-mysql-login-db.sql`

This command install database_scheme for local stroage.


#### 4. Run `yarn start`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the Node.js server (`node build/server.js`).

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)



