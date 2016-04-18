CREATE TABLE user (
    id int unsigned NOT NULL AUTO_INCREMENT,
    email varchar(127) NOT NULL,
    password varchar(31) NOT NULL,
    creationDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isValid tinyint(1) unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY pk_user_id (id),
    UNIQUE KEY u_user_email (email)
);

CREATE TABLE toValid (
    userId int unsigned NOT NULL,
    token varchar(127) NOT NULL,
    creationDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY pk_toValid_userId (userId),
    CONSTRAINT fk_toValid_userId FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE token (
    userId int unsigned,
    token varchar(127) NOT NULL,
    nonce varchar(127),
    creationDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expirationDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY i_token_userId (userId),
    CONSTRAINT fk_token_userId FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE domain (
    id tinyint unsigned NOT NULL AUTO_INCREMENT,
    label varchar(31) NOT NULL,
    PRIMARY KEY pk_domain_id (id)
);

CREATE TABLE expert (
    id int unsigned NOT NULL AUTO_INCREMENT,
    userId int unsigned NOT NULL,
    domainId tinyint unsigned NOT NULL,
    skills mediumtext NOT NULL,
    PRIMARY KEY pk_expert_id (id),
    KEY i_expert_userId (userId),
    KEY i_expert_domainId (domainId),
    UNIQUE KEY u_expert_userId_domainId (userId, domainId),
    CONSTRAINT fk_expert_userId FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expert_domainId FOREIGN KEY (domainId) REFERENCES domain(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE delegation (
    userId int unsigned NOT NULL,
    expertId int unsigned NOT NULL,
    PRIMARY KEY pk_delegation_userId_expertId_domainId (userId, expertId, domainId),
    CONSTRAINT fk_delegation_userId FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_delegation_expertId FOREIGN KEY (expertId) REFERENCES expert(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_delegation_domainId FOREIGN KEY (domainId) REFERENCES domain(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE proposition (
    id int unsigned NOT NULL AUTO_INCREMENT,
    label varchar(255) NOT NULL,
    description longtext NOT NULL,
    creation_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    domainId tinyint unsigned NOT NULL,
    parentId int unsigned,
    PRIMARY KEY pk_proposition_id (id),
    KEY i_proposition_domainId (domainId),
    KEY i_proposition_parentId (parentId),
    CONSTRAINT fk_proposition_domainId FOREIGN KEY (domainId) REFERENCES domain(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_proposition_parentId FOREIGN KEY (parentId) REFERENCES proposition(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE vote (
    userId int unsigned NOT NULL,
    propositionId int unsigned NOT NULL,
    pro tinyint(1) unsigned NOT NULL,
    PRIMARY KEY (userId, propositionId),
    CONSTRAINT fk_vote_propositionId FOREIGN KEY (propositionId) REFERENCES proposition(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE message (
    id int unsigned NOT NULL AUTO_INCREMENT,
    userId int unsigned NOT NULL,
    label varchar(255) NOT NULL,
    content text NOT NULL,
    isRed tinyint(1) unsigned NOT NULL DEFAULT 0,
    creationDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_message_idUser FOREIGN KEY (userId) REFERENCES user(id)
);