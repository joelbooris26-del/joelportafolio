export type NicheId =
  | "salud"
  | "inmobiliaria"
  | "taller"
  | "restaurante"
  | "estetica"
  | "fitness"
  | "legal"
  | "ecommerce";

export type NicheRule = {
  keys: string[];
  intent: string;
  reply: string;
  chips?: string[];
  follow?: string;
};

export type NicheData = {
  id: NicheId;
  label: string;
  tag: string;
  companyName: string;
  avatarText: string;
  avatarBg: string;
  roleSubtitle: string;
  verified: boolean;
  phoneHeader: string;
  chatbot: {
    welcome: string;
    chips: string[];
    rules: NicheRule[];
    fallback: string;
  };
  call: {
    scenarioTitle: string;
    targetPerson: string;
    targetContext: string;
    callerNumber: string;
    script: { who: "agente" | "cliente"; text: string }[];
    summary: {
      title: string;
      description: string;
      sentiment: string;
      actions: string[];
    };
  };
  supportTicket: {
    id: string;
    canal: "WhatsApp" | "Email" | "Instagram" | "Web";
    from: string;
    subject: string;
    body: string;
    time: string;
    priority: "Alta" | "Media" | "Baja";
    intent: string;
    topic: string;
    draft: string;
  };
  booking: {
    businessType: string;
    professionals: string[];
    services: { id: string; name: string; dur: number; price: number; pro: string }[];
    defaultBusy: { dayOffset: number; time: string; title: string; pro: string }[];
  };
};

export const nichesData: Record<NicheId, NicheData> = {
  salud: {
    id: "salud",
    label: "Salud & Clínicas",
    tag: "Clínica Dental / Médica",
    companyName: "Clínica Médica Bahía",
    avatarText: "CM",
    avatarBg: "bg-emerald-700",
    roleSubtitle: "Cuenta de empresa oficial · Atención 24/7",
    verified: true,
    phoneHeader: "+34 956 88 12 40 · Clínica Bahía",
    chatbot: {
      welcome:
        "¡Hola! Soy el asistente virtual de Clínica Médica Bahía. ¿En qué te puedo ayudar hoy? Puedo darte cita, consultar seguros, tarifas o atender una urgencia.",
      chips: ["Pedir cita previa", "¿Aceptáis Adeslas o Sanitas?", "Tengo una urgencia", "¿Qué horario tenéis?"],
      rules: [
        {
          keys: ["cita", "reservar", "pedir hora", "hueco", "agenda"],
          intent: "Cita previa médica",
          reply:
            "Con mucho gusto. Tenemos hueco mañana a las 10:30 con la Dra. Méndez o el jueves a las 17:00 con el Dr. Sotomayor. ¿Cuál prefieres?",
          chips: ["Mañana a las 10:30", "Jueves a las 17:00", "Ver más fechas"],
        },
        {
          keys: ["manana a las 10:30", "10:30", "jueves a las 17:00", "17:00"],
          intent: "Confirmación de cita",
          reply:
            "¡Perfecto! Te he reservado la cita. Te llegará un SMS y recordatorio por WhatsApp 24 horas antes con las indicaciones de llegada.",
          follow: "Si necesitas modificar la fecha en cualquier momento, solo escríbeme por aquí.",
          chips: ["Consultar ubicación", "¿Hay parking cerca?", "Muchas gracias"],
        },
        {
          keys: ["seguro", "adeslas", "sanitas", "mapfre", "asisa", "dkv", "mutua"],
          intent: "Consulta de aseguradoras",
          reply:
            "Trabajamos con Adeslas, Sanitas, Asisa, Mapfre y DKV. Cubrimos consultas generales, limpiezas y radiografías según tu póliza sin coste adicional.",
          chips: ["Pedir cita previa", "¿Qué precio tiene sin seguro?"],
        },
        {
          keys: ["precio", "tarifa", "cuanto", "cuesta", "limpieza", "revision", "presupuesto"],
          intent: "Tarifas de consulta",
          reply:
            "La primera consulta con diagnóstico y radiografía es gratuita. Limpieza con ultrasonidos: 40 €. Empaste: desde 45 €. Tratamientos complejos con financiación en hasta 36 meses sin intereses.",
          chips: ["Pedir primera cita gratuita", "¿Aceptáis seguros?"],
        },
        {
          keys: ["urgencia", "urgente", "dolor", "sangre", "muela", "diente", "grave"],
          intent: "Urgencia médica · Prioridad 1",
          reply:
            "Entendido, te paso como urgencia prioritaria. Tenemos un hueco de guardia hoy a las 18:15. Mientras vienes: evita aplicar calor en la zona y toma analgésico según indicación médica.",
          follow: "He notificado a recepción para que tengan el box listo a tu llegada.",
          chips: ["Confirmar asistencia a las 18:15", "Llamar directo a la clínica"],
        },
        {
          keys: ["horario", "abierto", "cerrado", "sabado", "tarde"],
          intent: "Horario de atención",
          reply:
            "Abrimos de Lunes a Viernes de 09:00 a 20:30 ininterrumpido, y Sábados de 09:30 a 14:00. Las urgencias se canalizan por este chat 24/7.",
          chips: ["Pedir cita previa", "¿Dónde estáis?"],
        },
      ],
      fallback:
        "Disculpa, no he localizado esa consulta en nuestro protocolo médico. ¿Deseas pedir cita, consultar precios, aseguradoras o hablar con un recepcionista?",
    },
    call: {
      scenarioTitle: "Recordatorio y confirmación de cita médica",
      targetPerson: "María Valenzuela",
      targetContext: "Revisión anual con Dra. Méndez",
      callerNumber: "+34 956 88 12 40",
      script: [
        {
          who: "agente",
          text: "Buenos días, María. Le llamo desde Clínica Médica Bahía para confirmar su cita de mañana a las 10:30 con la Dra. Méndez. ¿Le viene bien acudir?",
        },
        { who: "cliente", text: "Hola. Justo me ha surgido una reunión a esa hora y no voy a poder ir." },
        {
          who: "agente",
          text: "No se preocupe. Tenemos disponible mañana a las 16:30 o el viernes a las 11:00. ¿Cuál le encaja mejor?",
        },
        { who: "cliente", text: "El viernes a las 11:00 me viene fantástico." },
        {
          who: "agente",
          text: "Perfecto, queda modificada su cita para el viernes a las 11:00 con la Dra. Méndez. Le acabo de enviar el justificante por WhatsApp y SMS.",
        },
        { who: "cliente", text: "Muchísimas gracias por la rapidez." },
        { who: "agente", text: "A usted, María. Que tenga muy buen día." },
      ],
      summary: {
        title: "Cita reprogramada con éxito",
        description:
          "La paciente no podía asistir a las 10:30 por motivos laborales. Se reasignó al viernes a las 11:00 con la misma especialista. Sentimiento positivo.",
        sentiment: "Positivo (98%)",
        actions: [
          "Google Calendar & CRM médico actualizados",
          "Hueco de mañana a las 10:30 liberado en la web",
          "SMS y WhatsApp de confirmación enviados",
          "Historial del paciente registrado",
        ],
      },
    },
    supportTicket: {
      id: "T-8921",
      canal: "WhatsApp",
      from: "Carlos Benítez (+34 611 23 45 67)",
      subject: "Duda sobre cobertura de prótesis con Sanitas",
      body: "Buenas tardes, tengo que hacerme una endodoncia y una corona y quería saber si mi póliza de Sanitas Dental cubre el 100% o si tengo que abonar algún copago antes de la intervención.",
      time: "hace 4 min",
      priority: "Media",
      intent: "Consulta de cobertura de seguro",
      topic: "Facturación & Seguros",
      draft:
        "Estimado Carlos,\n\nCon su póliza Sanitas Dental Plus, la endodoncia tiene cobertura completa con copago bonificado de 18 €, y la corona cerámica tiene un descuento del 40% sobre tarifa oficial (quedando en 185 € con garantía de 5 años).\n\nSi lo desea, le preparamos el plan de tratamiento formal para que lo revise antes de su cita del martes.\n\nAtentamente,\nAtención al Paciente · Clínica Médica Bahía",
    },
    booking: {
      businessType: "Consulta médica / odontológica",
      professionals: ["Dra. Méndez", "Dr. Sotomayor", "Dra. Ramos"],
      services: [
        { id: "rev", name: "Revisión + Diagnóstico", dur: 30, price: 0, pro: "Dra. Méndez" },
        { id: "limp", name: "Limpieza Ultrasónica", dur: 45, price: 40, pro: "Dra. Ramos" },
        { id: "emp", name: "Empaste Dental", dur: 40, price: 45, pro: "Dr. Sotomayor" },
        { id: "orto", name: "Estudio de Ortodoncia", dur: 60, price: 0, pro: "Dra. Méndez" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "11:00", title: "Limpieza · Laura P.", pro: "Dra. Ramos" },
        { dayOffset: 0, time: "16:00", title: "Empaste · Jorge R.", pro: "Dr. Sotomayor" },
        { dayOffset: 1, time: "10:30", title: "Revisión · Marta G.", pro: "Dra. Méndez" },
      ],
    },
  },

  inmobiliaria: {
    id: "inmobiliaria",
    label: "Inmobiliaria & Fincas",
    tag: "Agencia Inmobiliaria",
    companyName: "Costa & Fincas Real Estate",
    avatarText: "CF",
    avatarBg: "bg-blue-900",
    roleSubtitle: "Agente Virtual Certificado · Asesoría Inmobiliaria",
    verified: true,
    phoneHeader: "+34 956 70 33 20 · Costa Real Estate",
    chatbot: {
      welcome:
        "¡Hola! Soy Alex, el asesor inteligente de Costa & Fincas. ¿Buscas comprar, alquilar o vender un inmueble en la zona?",
      chips: ["Quiero comprar piso", "Quiero alquilar", "¿Cuánto vale mi casa?", "Agendar visita a un piso"],
      rules: [
        {
          keys: ["comprar", "piso", "casa", "chalet", "apartamento", "ático", "atico"],
          intent: "Búsqueda de compra",
          reply:
            "Tenemos 38 propiedades activas en Cádiz y Costa del Sol: pisos céntricos desde 135.000 € y áticos con terraza frente al mar desde 220.000 €. ¿Qué zona y presupuesto manejas?",
          chips: ["Zona playa / vistas al mar", "Centro ciudad", "Presupuesto hasta 200.000 €"],
        },
        {
          keys: ["visita", "visitar", "ver", "quedar", "cita"],
          intent: "Agendar visita a inmueble",
          reply:
            "¡Claro! Los agentes tienen hueco para visitas presenciales o videollamadas 360° mañana a las 12:00 o jueves a las 18:30. ¿Qué propiedad te interesa visitar?",
          chips: ["Ático en Paseo Marítimo", "Piso de 3 habs en Centro", "Mañana a las 12:00"],
        },
        {
          keys: ["vender", "tasar", "tasacion", "tasación", "cuanto vale", "valor"],
          intent: "Tasación de propiedad",
          reply:
            "Hacemos valoración gratuita en 24 horas basada en datos reales de venta de tu barrio. Solo necesito la dirección aproximada y los metros cuadrados.",
          chips: ["Solicitar tasación gratuita", "Hablar con un agente"],
        },
        {
          keys: ["alquiler", "alquilar", "renta", "larga temporada"],
          intent: "Alquiler residencial",
          reply:
            "Disponemos de pisos de 2 y 3 dormitorios en alquiler de larga temporada desde 650 €/mes. Requisitos estándar: contrato de trabajo indefinido y 1 mes de fianza.",
          chips: ["Ver pisos disponibles", "Agendar visita"],
        },
      ],
      fallback:
        "Puedo mostrarte viviendas en venta o alquiler, concertar visitas con nuestros agentes o tasar tu propiedad actual. ¿Cuál de estas opciones necesitas?",
    },
    call: {
      scenarioTitle: "Cualificación de comprador y cita de visita",
      targetPerson: "David Serrano",
      targetContext: "Interesado en Ático Paseo de Levante (Ref: AT-302)",
      callerNumber: "+34 956 70 33 20",
      script: [
        {
          who: "agente",
          text: "Hola David, le llamo de Costa & Fincas respecto a su solicitud sobre el ático de 3 dormitorios en primera línea de playa. ¿Tiene un minuto?",
        },
        { who: "cliente", text: "Hola, sí claro. Quería saber si tiene plaza de garaje y si el precio es negociable." },
        {
          who: "agente",
          text: "Sí, incluye 2 plazas de garaje y trastero. Los propietarios están abiertos a ofertas razonables. ¿Le gustaría hacer una visita presencial mañana a las 17:00 con nuestro agente Lucas?",
        },
        { who: "cliente", text: "Mañana a las 17:00 me viene perfecto. ¿Dónde nos encontramos?" },
        {
          who: "agente",
          text: "En el portal del edificio. Le envío ahora mismo la ubicación exacta por WhatsApp y la ficha completa con planos y memoria de calidades.",
        },
        { who: "cliente", text: "Genial, nos vemos mañana allí." },
      ],
      summary: {
        title: "Lead cualificado · Visita confirmada",
        description:
          "Comprador con alta intención y capacidad de pago. Interesado en plazas de garaje. Visita coordinada para mañana 17:00 con Lucas.",
        sentiment: "Muy positivo (95%)",
        actions: [
          "Ficha y plano enviados por WhatsApp",
          "Evento creado en Google Calendar de Lucas",
          "Propietario notificado de la visita",
          "Lead asignado a 'Fase Visita' en CRM Inmobiliario",
        ],
      },
    },
    supportTicket: {
      id: "T-4092",
      canal: "Web",
      from: "Elena Márquez (elena.marquez@correo.com)",
      subject: "Solicitud de documentación de venta para Chalet Ref: CH-108",
      body: "Hola, estamos tramitando la hipoteca con el banco para el chalet de La Alcaidesa y el tasador nos pide la Nota Simple actualizada y el certificado de IBI al día. ¿Nos lo podéis enviar?",
      time: "hace 10 min",
      priority: "Alta",
      intent: "Petición de documentación legal",
      topic: "Gestión Notarial & Hipotecaria",
      draft:
        "Hola Elena,\n\nTe adjunto la Nota Simple informativa expedida por el Registro esta misma semana y el último recibo del IBI libre de cargas.\n\nTambién te incluyo el Certificado de Eficiencia Energética para que tu banco disponga de todo el expediente completo.\n\nQuedamos a vuestra disposición para coordinar la fecha de firma en Notaría.\n\nUn cordial saludo,\nEquipo Jurídico · Costa & Fincas Real Estate",
    },
    booking: {
      businessType: "Visitas inmobiliarias y asesoramiento",
      professionals: ["Lucas (Agente Zona Mar)", "Patricia (Asesora Financiera)"],
      services: [
        { id: "visita_piso", name: "Visita Inmueble Presencial", dur: 45, price: 0, pro: "Lucas" },
        { id: "tour_virtual", name: "Videollamada Tour 360°", dur: 30, price: 0, pro: "Lucas" },
        { id: "asesoria_hipo", name: "Estudio Viabilidad Hipoteca", dur: 60, price: 0, pro: "Patricia" },
        { id: "tasacion", name: "Visita Valoración Gratuita", dur: 45, price: 0, pro: "Lucas" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "10:00", title: "Visita Ático · David S.", pro: "Lucas" },
        { dayOffset: 1, time: "12:30", title: "Estudio Hipoteca · Ramón G.", pro: "Patricia" },
      ],
    },
  },

  taller: {
    id: "taller",
    label: "Taller & Mecánica",
    tag: "Taller Mecánico & Diagnosis",
    companyName: "Taller MotorTech Diagnosis",
    avatarText: "MT",
    avatarBg: "bg-amber-950",
    roleSubtitle: "Asistente Oficial de Taller · Citas y Presupuestos",
    verified: true,
    phoneHeader: "+34 956 22 90 10 · Taller MotorTech",
    chatbot: {
      welcome:
        "¡Buenas! Soy el asistente de MotorTech. ¿Necesitas cita para revisión, cambio de neumáticos, pre-ITV o tienes una avería?",
      chips: ["Pedir cita para revisión", "¿Cuánto cuesta cambio de aceite?", "Revisión Pre-ITV", "Tengo una avería extraña"],
      rules: [
        {
          keys: ["aceite", "mantenimiento", "revision", "revisión", "filtros"],
          intent: "Mantenimiento periódico",
          reply:
            "El pack de cambio de aceite sintético 5W30 + filtro de aceite + revisión de 30 puntos de seguridad sale por 79 € con IVA incluido. Se hace en 45 minutos.",
          chips: ["Pedir cita de mantenimiento", "¿Incluye coche de sustitución?"],
        },
        {
          keys: ["itv", "pre-itv", "pasar itv"],
          intent: "Servicio Pre-ITV y traslado",
          reply:
            "Hacemos revisión Pre-ITV completa por 29 €. Y si quieres, llevamos nosotros tu coche a la estación de ITV por 35 € adicionales + tasas.",
          chips: ["Pedir cita Pre-ITV", "Ver horarios disponibles"],
        },
        {
          keys: ["averia", "avería", "ruido", "testigo", "freno", "embrague", "bateria", "batería", "motor"],
          intent: "Diagnosis mecánica",
          reply:
            "Disponemos de diagnosis electrónica multimarca oficial por 30 € (gratuita si realizas la reparación con nosotros). Te damos presupuesto cerrado antes de tocar nada.",
          chips: ["Traer coche mañana", "Pedir cita para diagnosis"],
        },
        {
          keys: ["cita", "reservar", "hora", "cuando"],
          intent: "Reserva de taller",
          reply:
            "Tenemos boxes libres mañana a las 08:30 (dejas el coche antes de entrar a trabajar) o a las 15:30. ¿Qué matrícula y modelo es?",
          chips: ["Mañana a las 08:30", "Mañana a las 15:30"],
        },
      ],
      fallback:
        "Puedo darte presupuesto de mantenimiento, neumáticos, pre-ITV o agendar entrada al taller para diagnosis. ¿Qué vehículo tienes?",
    },
    call: {
      scenarioTitle: "Aviso de vehículo listo y presupuesto complementario",
      targetPerson: "Roberto Gómez",
      targetContext: "Volkswagen Golf VII · Revisión 120.000 km",
      callerNumber: "+34 956 22 90 10",
      script: [
        {
          who: "agente",
          text: "Hola Roberto, le llamo de Taller MotorTech para avisarle de que la revisión y cambio de filtros de su Golf ya está completada con éxito.",
        },
        { who: "cliente", text: "¡Estupendo! ¿Ha salido todo bien en los frenos?" },
        {
          who: "agente",
          text: "El mecánico ha comprobado las pastillas traseras y les queda un 15% de vida (unos 2.500 km). Si desea cambiarlas hoy aprovechando que está en el elevador, son 65 € con mano de obra incluida.",
        },
        { who: "cliente", text: "Venga, perfecto, cámbialas ya y me olvido." },
        {
          who: "agente",
          text: "Anotado en la orden de trabajo. Su coche estará completamente listo para recoger a partir de las 18:00. Le mandamos el desglose a su WhatsApp.",
        },
        { who: "cliente", text: "Muchas gracias por avisarme." },
      ],
      summary: {
        title: "Reparación adicional aprobada · Coche listo",
        description:
          "El cliente autorizó el cambio de pastillas de freno traseras por 65 €. Se actualizó la orden de trabajo y la recogida queda programada para las 18:00.",
        sentiment: "Muy satisfecho (96%)",
        actions: [
          "Orden de taller actualizada (+65 €)",
          "Factura proforma generada",
          "WhatsApp de aviso de recogida programado para 17:45",
          "Historial técnico del vehículo registrado",
        ],
      },
    },
    supportTicket: {
      id: "T-5510",
      canal: "Email",
      from: "Marcos Varela (m.varela82@gmail.com)",
      subject: "Presupuesto embrague y distribución para Seat León 2.0 TDI",
      body: "Hola, se me ha encendido el testigo y el pedal de embrague patina en 3ª marcha. El coche tiene 165.000 km. ¿Podéis darme presupuesto de kit de embrague bimasa + kit de distribución con bomba de agua?",
      time: "hace 18 min",
      priority: "Alta",
      intent: "Solicitud de presupuesto de gran reparación",
      topic: "Mecánica Pesada",
      draft:
        "Hola Marcos,\n\nPara tu Seat León 2.0 TDI trabajamos con componentes de primer equipo (Sachs / Gates / Continental):\n\n· Kit de embrague + volante bimasa + cojinete hidráulico: 590 €\n· Kit de distribución + bomba de agua + anticongelante G12: 380 €\n· Mano de obra y reciclaje incluidos: 240 €\n· Total con IVA: 1.210 € (garantía de 2 años en piezas y mano de obra)\n\nPodemos ofrecerte pago fraccionado en 3, 6 o 12 meses y vehículo de cortesía gratuito durante los 2 días de taller.\n\n¿Deseas que te reservemos hueco para el lunes?\n\nUn saludo,\nEquipo Técnico · Taller MotorTech",
    },
    booking: {
      businessType: "Taller mecánico y diagnosis",
      professionals: ["Box 1 (Mecánica Rápida)", "Box 2 (Diagnosis & Electricidad)"],
      services: [
        { id: "aceite", name: "Cambio de Aceite + Filtro", dur: 45, price: 79, pro: "Box 1" },
        { id: "preitv", name: "Revisión Pre-ITV Completa", dur: 30, price: 29, pro: "Box 1" },
        { id: "diag", name: "Diagnosis Electrónica Fallo", dur: 40, price: 30, pro: "Box 2" },
        { id: "frenos", name: "Cambio Pastillas de Freno", dur: 50, price: 85, pro: "Box 1" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "09:00", title: "Aceite · Ford Focus", pro: "Box 1" },
        { dayOffset: 1, time: "16:00", title: "Diagnosis · BMW Serie 3", pro: "Box 2" },
      ],
    },
  },

  restaurante: {
    id: "restaurante",
    label: "Hostelería & Gastro",
    tag: "Restaurante & Brasa",
    companyName: "Marea Alta Gastrobar",
    avatarText: "MA",
    avatarBg: "bg-zinc-800",
    roleSubtitle: "Reservas & Asistente de Sala 24h",
    verified: true,
    phoneHeader: "+34 956 00 12 34 · Marea Alta",
    chatbot: {
      welcome:
        "¡Hola! Soy Sofía de Marea Alta. ¿Te reservo mesa para hoy, te muestro la carta de temporada o necesitas información de alérgenos?",
      chips: ["Reservar mesa para 2", "Ver carta y especialidades", "¿Tenéis terraza?", "¿Horarios de cocina?"],
      rules: [
        {
          keys: ["reservar", "mesa", "cenar", "comer", "personas", "comensales"],
          intent: "Reserva de mesa",
          reply:
            "¡Con mucho gusto! Tenemos turnos disponibles para almuerzo (13:30, 14:15, 15:00) y cena (20:30, 21:30, 22:30) en sala o terraza con vistas. ¿Para cuántas personas y qué día?",
          chips: ["2 personas hoy cena", "4 personas este sábado", "Terraza exterior"],
        },
        {
          keys: ["carta", "platos", "precio", "pescado", "arroz", "carne", "menu"],
          intent: "Consulta de menú y especialidades",
          reply:
            "Nuestra especialidad es el atún rojo de almadraba (18 €), la lubina salvaje a la brasa (24 €) y el arroz meloso de carabineros (21 €/pers). También Menú Degustación de 6 pases por 48 €.",
          chips: ["Reservar Menú Degustación", "Opciones sin gluten"],
        },
        {
          keys: ["gluten", "alergia", "celiaco", "celíaco", "vegano", "vegetariano", "lactosa"],
          intent: "Carta de alérgenos",
          reply:
            "El 80% de nuestra carta está adaptado para celíacos con protocolo estricto en cocina para evitar contaminación cruzada. Disponemos de pan, cerveza y postres artesanos sin gluten.",
          chips: ["Reservar mesa avisando alérgeno", "Ver carta"],
        },
      ],
      fallback:
        "Puedo guardarte mesa en sala o terraza, informarte de platos del día o gestionar eventos privados de grupo. ¿Qué te apetece?",
    },
    call: {
      scenarioTitle: "Confirmación de mesa para grupo en fin de semana",
      targetPerson: "Gonzalo Pardo",
      targetContext: "Mesa para 6 personas · Sábado noche",
      callerNumber: "+34 956 00 12 34",
      script: [
        {
          who: "agente",
          text: "Buenas tardes, Gonzalo. Le llamo de Marea Alta para reconfirmar su reserva de mesa para 6 personas este sábado a las 21:30 en terraza.",
        },
        { who: "cliente", text: "Hola, sí, seguimos yendo los 6. Una pregunta, ¿tendréis trona para un bebé?" },
        {
          who: "agente",
          text: "Por supuesto, le dejamos colocada una trona en la cabecera de la mesa y espacio cómodo para el carrito.",
        },
        { who: "cliente", text: "Maravilloso, muchas gracias por estar pendientes." },
        {
          who: "agente",
          text: "Un placer. Su mesa queda lista. Les esperamos el sábado a las 21:30. ¡Que pase buena tarde!",
        },
      ],
      summary: {
        title: "Reserva de grupo confirmada con trona",
        description:
          "Grupo de 6 comensales confirmado para el sábado 21:30 en terraza. Se anotó requerimiento de trona de bebé en la comanda.",
        sentiment: "Excelente (99%)",
        actions: [
          "Mesa 14 bloqueada en el plano de sala",
          "Nota para jefe de sala: Añadir trona",
          "Recordatorio enviado por WhatsApp con enlace de Google Maps",
        ],
      },
    },
    supportTicket: {
      id: "T-7180",
      canal: "Instagram",
      from: "@laura.gastroviajes",
      subject: "Presupuesto comida de empresa navidad (25 personas)",
      body: "Hola! Estamos organizando la cena de navidad de nuestra empresa para el viernes 19 de diciembre. Seremos unas 25 personas y queremos menú cerrado con maridaje incluido. ¿Qué opciones tenéis?",
      time: "hace 30 min",
      priority: "Alta",
      intent: "Evento de grupo y menú cerrado",
      topic: "Eventos & Grupos",
      draft:
        "¡Hola Laura!\n\nQué buena elección celebrar vuestra cena con nosotros. Para grupos de más de 15 personas disponemos de dos propuestas con barra libre de bodega durante el servicio:\n\n1. Menú Bahía (42 €/pers): 4 entrantes al centro, principal a elegir (lubina o presa ibérica) y postre casero.\n2. Menú Almadraba Selección (55 €/pers): 5 pases con atún rojo, arroz marinero, solomillo y maridaje premium.\n\nAmbos incluyen café, copa de cava de bienvenida y mesa reservada en salón privado.\n\n¿Te bloqueo provisionalmente el viernes 19 mientras revisáis el menú?\n\nUn saludo,\nSofía · Eventos Marea Alta",
    },
    booking: {
      businessType: "Restaurante y eventos gastronómicos",
      professionals: ["Zona Terraza Mar", "Salón Principal Brasa"],
      services: [
        { id: "almuerzo", name: "Mesa Almuerzo (2 a 4 pax)", dur: 90, price: 0, pro: "Zona Terraza Mar" },
        { id: "cena", name: "Mesa Cena (2 a 4 pax)", dur: 90, price: 0, pro: "Zona Terraza Mar" },
        { id: "degustacion", name: "Menú Degustación 6 Pases", dur: 120, price: 48, pro: "Salón Principal Brasa" },
        { id: "grupo", name: "Mesa Grupo (>6 pax)", dur: 120, price: 0, pro: "Salón Principal Brasa" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "14:00", title: "Mesa 4 · Familia R.", pro: "Zona Terraza Mar" },
        { dayOffset: 0, time: "21:30", title: "Mesa 8 · Gonzalo P. (6 pax)", pro: "Zona Terraza Mar" },
      ],
    },
  },

  estetica: {
    id: "estetica",
    label: "Estética & Salón",
    tag: "Salón de Belleza & Estilismo",
    companyName: "Studio D'Or Estilistas",
    avatarText: "SD",
    avatarBg: "bg-purple-950",
    roleSubtitle: "Agenda y Asistente de Belleza",
    verified: true,
    phoneHeader: "+34 956 44 20 80 · Studio D'Or",
    chatbot: {
      welcome:
        "¡Hola! Soy la asistente de Studio D'Or. ¿Quieres cita para corte, color/mechas, tratamiento capilar o manicura?",
      chips: ["Cita para corte y peinado", "Balayage / Mechas", "Tratamiento de Keratina", "Ver lista de precios"],
      rules: [
        {
          keys: ["corte", "peinado", "lavar", "secar"],
          intent: "Corte y peinado",
          reply:
            "El corte y peinado incluye diagnóstico capilar, lavado con masaje y styling por 28 €. Tenemos huecos mañana a las 11:30 con Claudia o a las 17:00 con Sara.",
          chips: ["Mañana a las 11:30", "Mañana a las 17:00", "Ver precios de mechas"],
        },
        {
          keys: ["mechas", "balayage", "tinte", "color", "decoloracion", "decoloración"],
          intent: "Servicio de coloración",
          reply:
            "Nuestras mechas Balayage / Babylights incluyen matiz iluminador y tratamiento protector Olaplex desde 75 €. Duración: 2h 30m.",
          chips: ["Pedir cita para Balayage", "Consultar otros tratamientos"],
        },
        {
          keys: ["keratina", "alisado", "hidratacion", "hidratación", "botox"],
          intent: "Tratamiento intensivo",
          reply:
            "El tratamiento de Keratina orgánica antifrizz dura hasta 4 meses y deja el cabello brillante y liso sin plancha por 110 €.",
          chips: ["Pedir cita Keratina", "Hablar con estilista"],
        },
      ],
      fallback:
        "Puedo reservarte cita con tu estilista favorita, indicarte tarifas de color y corte o explicarte tratamientos capilares. ¿Qué te gustaría hacerte?",
    },
    call: {
      scenarioTitle: "Confirmación de cita de tratamiento largo (Balayage)",
      targetPerson: "Lucía Morales",
      targetContext: "Balayage + Corte con Claudia (2h 30m)",
      callerNumber: "+34 956 44 20 80",
      script: [
        {
          who: "agente",
          text: "Hola Lucía, te llamo de Studio D'Or para reconfirmar tu sesión de Balayage de mañana jueves a las 16:00 con Claudia.",
        },
        { who: "cliente", text: "¡Hola! Sí, confirmadísimo. ¿Llegaré a tiempo si tengo que salir a las 18:45?" },
        {
          who: "agente",
          text: "La sesión suele llevar 2 horas y media. Para que estés 100% tranquila y sin prisas, ¿quieres que la adelantemos a las 15:30?",
        },
        { who: "cliente", text: "¡Ay sí, por favor! A las 15:30 me da margen de sobra." },
        {
          who: "agente",
          text: "Queda cambiada a las 15:30. Te mandamos ahora el recordatorio a tu móvil. ¡Hasta mañana Lucía!",
        },
      ],
      summary: {
        title: "Sesión adelantada por comodidad de la clienta",
        description:
          "Cita de Balayage reprogramada a las 15:30 para asegurar tiempo suficiente. Claudia tiene el puesto preparado.",
        sentiment: "Muy contenta (98%)",
        actions: [
          "Agenda de Claudia actualizada a las 15:30",
          "Recordatorio con nueva hora enviado por WhatsApp",
          "Hueco de las 18:00 liberado para secados rápidos",
        ],
      },
    },
    supportTicket: {
      id: "T-3320",
      canal: "WhatsApp",
      from: "Beatriz Naranjo (+34 677 88 99 00)",
      subject: "¿Se puede hacer mechas si llevo tinte oscuro?",
      body: "Hola! Llevo un castaño oscuro teñido de hace 3 meses y me gustaría ponerme rubia beige en una sola sesión. ¿Es posible sin estropear el pelo o tengo que hacer arrastre primero?",
      time: "hace 12 min",
      priority: "Media",
      intent: "Asesoramiento técnico de colorimetría",
      topic: "Color & Diagnóstico",
      draft:
        "¡Hola Beatriz!\n\nAl llevar pigmento oscuro previo, para conseguir un rubio beige luminoso y mantener el cabello 100% sano recomendamos realizar una prueba de mecha previa gratuita (toma solo 10 minutos en el salón).\n\nAsí comprobamos la elasticidad y cuánto aclara tu base de forma segura. Si quieres te doy un hueco rápido hoy o mañana para revisarlo y darte presupuesto exacto.\n\n¿Qué día te viene bien pasarte?\n\nUn abrazo,\nEquipo Studio D'Or",
    },
    booking: {
      businessType: "Salón de peluquería y estética",
      professionals: ["Claudia (Colorista)", "Sara (Estilista)"],
      services: [
        { id: "corte", name: "Corte + Peinado Styling", dur: 45, price: 28, pro: "Sara" },
        { id: "balayage", name: "Mechas Balayage + Matiz", dur: 150, price: 85, pro: "Claudia" },
        { id: "keratina", name: "Tratamiento Keratina Antifrizz", dur: 120, price: 110, pro: "Claudia" },
        { id: "manicura", name: "Manicura Rusa Semipermanente", dur: 45, price: 25, pro: "Sara" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "11:00", title: "Corte · Andrea M.", pro: "Sara" },
        { dayOffset: 1, time: "16:00", title: "Balayage · Lucía M.", pro: "Claudia" },
      ],
    },
  },

  fitness: {
    id: "fitness",
    label: "Gimnasio & Fitness",
    tag: "Centro Deportivo & Entrenamiento",
    companyName: "IronBox Fitness Club",
    avatarText: "IB",
    avatarBg: "bg-neutral-800",
    roleSubtitle: "Membresías & Entrenamientos",
    verified: true,
    phoneHeader: "+34 956 55 10 90 · IronBox Fitness",
    chatbot: {
      welcome:
        "¡A tope! Soy el asistente de IronBox Fitness. ¿Quieres reservar tu clase de prueba gratuita, ver tarifas o consultar el horario de clases dirigidas?",
      chips: ["Reservar clase de prueba gratis", "Tarifas y cuotas", "Horarios de CrossFit/Spinning", "Entrenador personal"],
      rules: [
        {
          keys: ["prueba", "gratis", "primera clase", "probar"],
          intent: "Clase de prueba gratuita",
          reply:
            "¡Tu primera sesión es 100% gratis! Incluye acceso a sala de pesas o clase dirigida (CrossFit, Spinning o Pilates funcional) con monitor. ¿Qué día quieres venir?",
          chips: ["Mañana a las 18:30 (CrossFit)", "Mañana a las 19:30 (Spinning)", "Viernes mañana"],
        },
        {
          keys: ["precio", "tarifa", "cuota", "mes", "matricula", "matrícula"],
          intent: "Precios de membresía",
          reply:
            "Nuestras cuotas sin permanencia son: Acceso Total Ilimitado por 39,90 €/mes (matrícula gratis si te apuntas este mes) o Bono 10 Sesiones por 45 €. Incluye duchas, taquilla y app de seguimiento.",
          chips: ["Apuntarme online", "Probar clase gratis primero"],
        },
        {
          keys: ["horario", "clases", "crossfit", "spinning", "yoga", "boxeo"],
          intent: "Horario de actividades",
          reply:
            "El club abre de Lunes a Viernes de 06:30 a 23:00, y Sábados/Domingos de 08:30 a 20:00. Clases dirigidas cada hora de 07:00 a 21:30.",
          chips: ["Ver calendario de clases", "Reservar plaza"],
        },
      ],
      fallback:
        "Puedo reservarte tu clase de prueba gratuita, informarte sobre cuotas sin permanencia o planificar sesiones con entrenador personal. ¿Qué te interesa?",
    },
    call: {
      scenarioTitle: "Recuperación de socio inactivo con oferta exclusiva",
      targetPerson: "Javier Aranda",
      targetContext: "Ex-socio inactivo desde hace 2 meses",
      callerNumber: "+34 956 55 10 90",
      script: [
        {
          who: "agente",
          text: "¡Hola Javier! Te llamo de IronBox Fitness. Hemos visto que hace unas semanas que no te pasas por el box y queríamos saber si todo va bien.",
        },
        { who: "cliente", text: "Buenas. La verdad es que con el trabajo nuevo voy liado de horarios." },
        {
          who: "agente",
          text: "Te entendemos perfectamente. Hemos ampliado horario desde las 06:30 de la mañana y además te hemos activado un mes de regreso con 50% de descuento y rutina adaptada express de 40 minutos.",
        },
        { who: "cliente", text: "Oye, pues entrar a las 06:30 antes de la oficina me vendría perfecto." },
        {
          who: "agente",
          text: "¡Genial! Te reactivo el pase con el descuento y te asigno la rutina rápida en la app. Te esperamos mañana.",
        },
      ],
      summary: {
        title: "Socio reactivado con cuota especial",
        description:
          "Socio reactiva membresía motivado por el nuevo horario de mañana (06:30) y rutina express. Se aplicó descuento del 50% en el primer mes.",
        sentiment: "Muy motivado (94%)",
        actions: [
          "Membresía reactivada en el torno de acceso",
          "Rutina 'Express 40m' cargada en su app móvil",
          "Email de bienvenida con código QR de acceso",
        ],
      },
    },
    supportTicket: {
      id: "T-2289",
      canal: "Instagram",
      from: "@raul_running",
      subject: "¿Cómo funciona la congelación de cuota por viaje?",
      body: "Buenas, el mes que viene me voy 3 semanas fuera por trabajo y no podré ir al gimnasio. ¿Puedo pausar la cuota para no perder esos días o tengo que darme de baja y pagar matrícula otra vez?",
      time: "hace 45 min",
      priority: "Media",
      intent: "Gestión de cuota · Pausa temporal",
      topic: "Membresías & Bajas",
      draft:
        "¡Hola Raúl!\n\nNo tienes que darte de baja ni volver a pagar matrícula. En IronBox dispones del servicio 'Pausa Vacaciones / Trabajo' totalmente gratuito hasta por 60 días al año.\n\nSimplemente indícanos qué día sales y qué día regresas y pausamos el cobro de tu cuota de forma automática.\n\n¿Cuáles son las fechas de tu viaje para dejártelo configurado hoy mismo?\n\n¡Un saludo!\nEquipo IronBox Fitness",
    },
    booking: {
      businessType: "Centro de entrenamiento y clases",
      professionals: ["Coach Marcos", "Coach Andrea"],
      services: [
        { id: "prueba_cross", name: "Clase Prueba CrossFit", dur: 60, price: 0, pro: "Coach Marcos" },
        { id: "prueba_spin", name: "Clase Prueba Spinning", dur: 50, price: 0, pro: "Coach Andrea" },
        { id: "pt_sesion", name: "Sesión Entrenador Personal", dur: 60, price: 30, pro: "Coach Marcos" },
        { id: "bio_analisis", name: "Estudio Composición Corporal", dur: 30, price: 15, pro: "Coach Andrea" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "18:00", title: "CrossFit WOD · Grupo A", pro: "Coach Marcos" },
        { dayOffset: 1, time: "19:00", title: "Spinning Pro · Grupo B", pro: "Coach Andrea" },
      ],
    },
  },

  legal: {
    id: "legal",
    label: "Legal & Asesoría",
    tag: "Despacho de Abogados & Gestoría",
    companyName: "Meridiano Abogados & Asesores",
    avatarText: "MA",
    avatarBg: "bg-slate-900",
    roleSubtitle: "Consultoría Legal & Fiscal Certificada",
    verified: true,
    phoneHeader: "+34 956 90 80 70 · Meridiano Abogados",
    chatbot: {
      welcome:
        "Le damos la bienvenida a Meridiano Abogados. ¿En qué área jurídica o de asesoría fiscal podemos asistirle hoy?",
      chips: ["Consulta Laboral / Despido", "Herencias y Testamentos", "Asesoría Fiscal Autónomos/SL", "Solicitar cita con letrado"],
      rules: [
        {
          keys: ["laboral", "despido", "finiquito", "contrato", "empresa"],
          intent: "Derecho Laboral",
          reply:
            "Analizamos su caso de despido o reclamación de cantidad en 24h. Primera consulta orientativa con cálculo de indemnización legal.",
          chips: ["Cita con especialista laboral", "¿Qué documentación llevo?"],
        },
        {
          keys: ["herencia", "testamento", "sucesion", "sucesión", "plusvalia"],
          intent: "Derecho Sucesorio & Herencias",
          reply:
            "Gestionamos herencias de forma integral: declaración de herederos, liquidación del Impuesto de Sucesiones y adjudicación notarial.",
          chips: ["Pedir cita de herencias", "Consultar honorarios"],
        },
        {
          keys: ["autonomo", "autónomo", "sl", "sociedad", "fiscal", "renta", "impuestos", "iva", "irpf"],
          intent: "Asesoría Fiscal & Contable",
          reply:
            "Pack Integral Autónomos desde 49 €/mes (presentación de trimestres, facturación online y asesor asignado). Creación de SL en 48 horas.",
          chips: ["Alta de autónomo", "Cita con asesor fiscal"],
        },
      ],
      fallback:
        "Podemos concertar una cita presencial o telemática con el letrado especialista en su materia. ¿Desea ver fechas disponibles?",
    },
    call: {
      scenarioTitle: "Revisión previa a firma en Notaría",
      targetPerson: "Carmen Toledo",
      targetContext: "Expediente de Compraventa y Herencia (Ref: EXP-88)",
      callerNumber: "+34 956 90 80 70",
      script: [
        {
          who: "agente",
          text: "Buenas tardes, Doña Carmen. Le llamamos de Meridiano Abogados para confirmarle que la Notaría ya tiene revisada toda la documentación de la escritura para el lunes a las 11:30.",
        },
        { who: "cliente", text: "Buenas tardes. Perfecto, ¿tengo que llevar el cheque bancario original?" },
        {
          who: "agente",
          text: "Sí, debe aportar el DNI en vigor y el cheque bancario nominativo que preparamos con su entidad. Nuestro letrado D. Fernando estará con usted 15 minutos antes en la Notaría.",
        },
        { who: "cliente", text: "Excelente, muchas gracias por acompañarme durante todo el proceso." },
        {
          who: "agente",
          text: "Para eso estamos, Doña Carmen. Le enviamos un resumen de la liquidación provisional por correo electrónico. Buen fin de semana.",
        },
      ],
      summary: {
        title: "Firma notarial coordinada con acompañamiento legal",
        description:
          "Cliente instruida sobre cheque y DNI original para la firma del lunes 11:30 en Notaría. Letrado asignado.",
        sentiment: "Muy tranquila y agradecida (98%)",
        actions: [
          "Expediente notarial cerrado y validado",
          "Cita sincronizada en calendario del letrado",
          "Borrador de escritura enviado por email protegido",
        ],
      },
    },
    supportTicket: {
      id: "T-9014",
      canal: "Email",
      from: "Víctor Salgado (v.salgado@innova-tech.es)",
      subject: "Duda sobre deducción de gastos de I+D en Impuesto de Sociedades",
      body: "Estimados señores, estamos cerrando el ejercicio contable de nuestra empresa de software y queremos aplicar la deducción fiscal por proyectos de I+D+i del artículo 35 de la LIS. ¿Qué documentación técnica y memoria requerimos para justificarlo ante la Agencia Tributaria?",
      time: "hace 2 horas",
      priority: "Alta",
      intent: "Consultoría tributaria avanzada B2B",
      topic: "Fiscalidad Corporativa",
      draft:
        "Estimado Víctor,\n\nPara aplicar con total seguridad jurídica la deducción por I+D+i en el Modelo 200 requerimos:\n\n1. Memoria técnica descriptiva del proyecto y desglose de horas del personal cualificado.\n2. Certificación de gastos directos e indirectos imputables al desarrollo.\n3. Opcionalmente (y muy recomendado): Informe Motivado Vinculante emitido por el Ministerio de Ciencia e Innovación.\n\nPodemos coordinar una reunión de 30 minutos por Teams este jueves a las 10:00 para revisar vuestro borrador de memoria.\n\nAtentamente,\nÁrea Fiscal & Tributaria · Meridiano Abogados",
    },
    booking: {
      businessType: "Despacho jurídico y asesoría fiscal",
      professionals: ["D. Fernando (Letrado Senior)", "Dña. Rocío (Asesora Fiscal)"],
      services: [
        { id: "cons_legal", name: "Consulta Jurídica General", dur: 45, price: 60, pro: "D. Fernando" },
        { id: "cons_laboral", name: "Reclamación / Despido Laboral", dur: 45, price: 50, pro: "D. Fernando" },
        { id: "cons_fiscal", name: "Planificación Fiscal Autónomo/SL", dur: 60, price: 60, pro: "Dña. Rocío" },
        { id: "cons_herencia", name: "Asesoramiento Herencias", dur: 60, price: 70, pro: "D. Fernando" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "11:30", title: "Firma Notaría · Carmen T.", pro: "D. Fernando" },
        { dayOffset: 1, time: "17:00", title: "Planificación SL · Víctor S.", pro: "Dña. Rocío" },
      ],
    },
  },

  ecommerce: {
    id: "ecommerce",
    label: "E-Commerce & Retail",
    tag: "Tienda Online & Logística",
    companyName: "NovaShop Tienda Oficial",
    avatarText: "NS",
    avatarBg: "bg-blue-950",
    roleSubtitle: "Atención al Cliente & Pedidos 24/7",
    verified: true,
    phoneHeader: "+34 900 80 40 20 · NovaShop Atención",
    chatbot: {
      welcome:
        "¡Hola! Bienvenido al soporte de NovaShop. ¿Necesitas localizar tu pedido, gestionar una devolución o solicitar factura?",
      chips: ["¿Dónde está mi pedido?", "Tramitar una devolución", "El producto llegó dañado", "Cambio de talla / modelo"],
      rules: [
        {
          keys: ["pedido", "donde", "dónde", "seguimiento", "tracking", "paquete", "reparto"],
          intent: "Tracking de pedido",
          reply:
            "Los pedidos realizados antes de las 17:00 se entregan en 24h laborables por GLS / Correos Express. Si me facilitas tu número de pedido (ej: #NV-4020) te digo el estado exacto en tiempo real.",
          chips: ["Pedido #NV-4020", "Pedido #NV-4099", "Hablar con soporte"],
        },
        {
          keys: ["devolucion", "devolución", "devolver", "reembolso", "cambiar", "talla"],
          intent: "Política de devoluciones",
          reply:
            "Dispones de 30 días naturales para devoluciones gratuitas. Te enviamos la etiqueta prepagada para dejarlo en cualquier Punto Pack o solicitar recogida a domicilio.",
          chips: ["Generar etiqueta de devolución", "Cambio de talla sin coste"],
        },
        {
          keys: ["dañado", "golpe", "roto", "defecto", "garantia", "garantía"],
          intent: "Incidencia de producto dañado",
          reply:
            "Lamentamos el inconveniente. Te enviamos una unidad nueva de sustitución urgente hoy mismo sin esperar a que recojamos la dañada.",
          chips: ["Subir foto del daño", "Solicitar reemplazo hoy"],
        },
      ],
      fallback:
        "Indícame tu número de pedido o consulta y resolveré el trámite al instante con nuestro almacén.",
    },
    call: {
      scenarioTitle: "Resolución proactiva de incidencia de transporte",
      targetPerson: "Alberto Domínguez",
      targetContext: "Pedido #NV-5541 · Retenido en delegación",
      callerNumber: "+34 900 80 40 20",
      script: [
        {
          who: "agente",
          text: "Hola Alberto, le llamamos del departamento de envíos de NovaShop respecto a su pedido #NV-5541. El mensajero no ha podido localizar el número de portal de entrega.",
        },
        { who: "cliente", text: "Hola. Sí, es que es una urbanización nueva y a veces el GPS se confunde, es el portal 4B." },
        {
          who: "agente",
          text: "Perfecto, acabamos de añadir la indicación directa al repartidor y su entrega queda programada para hoy antes de las 19:30.",
        },
        { who: "cliente", text: "¡Qué maravilla que me hayáis llamado vosotros antes de que se devolviera!" },
        {
          who: "agente",
          text: "Para eso estamos Alberto. En cuanto esté en reparto final recibirá un SMS con el PIN de entrega.",
        },
      ],
      summary: {
        title: "Incidencia de entrega resuelta proactivamente",
        description:
          "Se aclararon las señas del portal 4B con el cliente antes del segundo intento de reparto. Paquete entregado hoy.",
        sentiment: "Encantado con el servicio (100%)",
        actions: [
          "Instrucciones enviadas a la PDA del transportista",
          "Estado de pedido actualizado a 'En reparto preferente'",
          "Alerta en CRM cerrada con resolución positiva",
        ],
      },
    },
    supportTicket: {
      id: "T-6640",
      canal: "Email",
      from: "Patricia Valls (patricia.valls@hotmail.com)",
      subject: "Artículo equivocado en pedido #NV-6640",
      body: "Hola, compré una chaqueta talla L en color negro y me ha llegado una talla M en color azul marino. La necesito para un viaje el viernes. ¿Cómo lo solucionamos rápido?",
      time: "hace 8 min",
      priority: "Alta",
      intent: "Error de preparación de envío",
      topic: "Logística & Envíos Urgentes",
      draft:
        "Hola Patricia,\n\nTe pedimos mil disculpas por la confusión en el picking de almacén.\n\nPara que la tengas a tiempo para tu viaje del viernes, acabamos de emitir una orden de envío urgente 24h con la chaqueta en talla L color negro que saldrá hoy a las 16:00. Te llegará mañana jueves entre las 09:00 y las 14:00.\n\nEl mismo mensajero recogerá la prenda equivocada sin que tengas que imprimir ninguna etiqueta ni desplazarte.\n\nTe adjuntamos el número de seguimiento urgente.\n\nUn cordial saludo,\nEquipo de Calidad · NovaShop",
    },
    booking: {
      businessType: "Asesoría de producto y compras personalizadas",
      professionals: ["Personal Shopper 1", "Especialista Técnico"],
      services: [
        { id: "personal_shopper", name: "Videollamada Asesoría de Estilo", dur: 30, price: 0, pro: "Personal Shopper 1" },
        { id: "demo_producto", name: "Demostración Técnica de Producto", dur: 30, price: 0, pro: "Especialista Técnico" },
        { id: "b2b_meeting", name: "Reunión Comercial Mayoristas / B2B", dur: 45, price: 0, pro: "Especialista Técnico" },
      ],
      defaultBusy: [
        { dayOffset: 0, time: "16:30", title: "Demo Producto · Carlos E.", pro: "Especialista Técnico" },
        { dayOffset: 1, time: "11:00", title: "Asesoría B2B · Grupo Retail", pro: "Especialista Técnico" },
      ],
    },
  },
};
