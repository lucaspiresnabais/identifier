const mongoose = require("mongoose");

const visitaSchema = new mongoose.Schema(
  {
    idVisitador: {
      type: String,
    },
    idReceptor: {
      type: String,
    },
    mailVisitador: {
      type: String,
    },
    tipoDoc: {
      type: String,
    },
    nroDoc: {
      type: String,
    },
    nombre: {
      type: String,
    },
    mailReceptor: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    diaHoraDesde: {
      type: Number,
    },
    diaHoraHasta: {
      type: Number,
    },
    estado: {
      type: String,
    },
    qrpaquete: {
      type: String,
    },
    cbpaquete: {
      type: String,
    },
    enteid: {
      ref: "entes",
      type: mongoose.Schema.Types.ObjectId,
    },
    datosmsg: [
      {
        clave: String,
        valor: String,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const entes = new mongoose.Schema(
  {
    ente: {
      type: String,
    },
    sector: {
      type: String,
    },
    servicio: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const parametria = new mongoose.Schema(
  {
    entex: {
      ref: "entes",
      type: mongoose.Schema.Types.ObjectId,
    },

    envWapp: {
      type: Boolean,
      default: true,
    },
    envMail: {
      type: Boolean,
      default: true,
    },
    estadoServicio: {
      type: String /*Habilidato,Suspendido, bloqueado*/,
    },
    textoWapp: {
      type: String,
    },
    textoMail: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const users = new mongoose.Schema(
  {
    user: { type: String, unique: true },
    password: { type: String, require: true },

    codEnte: {
      ref: "Entes",
      type: mongoose.Schema.Types.ObjectId,
    },

    codSector: {
      type: Number,
    },
    codServicio: {
      type: Number,
    },
    roles: [
      {
        ref: "Roles",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const roles = new mongoose.Schema({
  rol: { type: String, unique: true },
});

mongoose.model("Visita", visitaSchema);
mongoose.model("Parametria", parametria);
mongoose.model("Users", users);
mongoose.model("Entes", entes);
mongoose.model("Roles", roles);
