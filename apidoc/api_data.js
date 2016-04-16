define({ "api": [
  {
    "type": "post",
    "url": "authentication/login",
    "title": "Attribue le token de session au user",
    "name": "Login",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nonce",
            "description": "<p>Valeur al�atoire donn�e par le front</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email du user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/AuthenticationWS.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "authentication/logout",
    "title": "Fait expirer le token de session du user",
    "name": "Logout",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/AuthenticationWS.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "authentication/secret",
    "title": "Retourne un token de session non attribu�",
    "name": "Secret",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/AuthenticationWS.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "delegation/create",
    "title": "Attribue la voix du user � l'expert donn�",
    "name": "Createdelegation",
    "group": "Delegation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expertId",
            "description": "<p>Id de l'expert � qui donner la voix</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/DelegationWS.js",
    "groupTitle": "Delegation"
  },
  {
    "type": "post",
    "url": "/delegation/delete",
    "title": "Retire la voix du user pour un expert sur un domaine",
    "name": "Deletedelegation",
    "group": "Delegation",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "expertId",
            "description": "<p>Id de l'expert � qui retirer la voix du user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/DelegationWS.js",
    "groupTitle": "Delegation"
  },
  {
    "type": "get",
    "url": "domain/get",
    "title": "Retourne la liste des domaines",
    "name": "Getdomain",
    "group": "Domain",
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/DomainWS.js",
    "groupTitle": "Domain"
  },
  {
    "type": "post",
    "url": "expert/create",
    "title": "Rajoute le user aux experts sur un domaine",
    "name": "CreateExpert",
    "group": "Expert",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donné par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilisée pour la génération du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "domainId",
            "description": "<p>id du domaine de l'expert</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skills",
            "description": "<p>compétences/présentation de l'expert (texte libre)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/ExpertWS.js",
    "groupTitle": "Expert"
  },
  {
    "type": "post",
    "url": "expert/delete",
    "title": "Enlève l'expertise au user",
    "name": "Deleteexpert",
    "group": "Expert",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donné par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilisée pour la génération du digest</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/ExpertWS.js",
    "groupTitle": "Expert"
  },
  {
    "type": "post",
    "url": "proposition/create",
    "title": "Fait expirer le token de session du user",
    "name": "Createproposition",
    "group": "Proposition",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "label",
            "description": "<p>Titre de la proposition</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description de la proposition</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "domainId",
            "description": "<p>Id du domaine de la proposition</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "parentId",
            "description": "<p>(Facultatif, amendements seulement) Id de la proposition � laquelle est rattach�e cet amendement</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/PropositionWS.js",
    "groupTitle": "Proposition"
  },
  {
    "type": "post",
    "url": "/getProposition",
    "title": "Retourne toutes les propositions, amen� � �voluer avec des param�tres optionnels",
    "name": "getProposition",
    "group": "Proposition",
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/PropositionWS.js",
    "groupTitle": "Proposition"
  },
  {
    "type": "post",
    "url": "/vote",
    "title": "Fait expirer le token de session du user",
    "name": "vote",
    "group": "Proposition",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vote",
            "description": "<p>'Y' (yes), 'N' (no) ou 'B' (blanc)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "propositionId",
            "description": "<p>Id de la proposition</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/PropositionWS.js",
    "groupTitle": "Proposition"
  },
  {
    "type": "post",
    "url": "user/create",
    "title": "Cr�e un user inactif",
    "name": "Createuser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email du compte</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>hash (algo � d�finir c�t� front, doit juste �tre reproductible) du password</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/UserWS.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/delete",
    "title": "Supprime le user",
    "name": "Deleteuser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de la session en cours (donn� par secret)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "digest",
            "description": "<p>Hash du login, password, date, token &amp; nonce</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>Date utilis�e pour la g�n�ration du digest</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>hash (algo � d�finir c�t� front, doit juste �tre reproductible) du password</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/UserWS.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "user/verify/:email/:token",
    "title": "Passe un user � actif",
    "name": "Verifyuser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token d'activation (normalement envoy� par mail, pas d�v pour le moment)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email du user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "nuitLiquide/webServices/UserWS.js",
    "groupTitle": "User"
  }
] });