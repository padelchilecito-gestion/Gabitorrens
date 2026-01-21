import { Product, ContactInfo, Banner, Reseller, Client, SiteContent, PaymentConfig, SocialReview, PeptoneFormula } from './types';

// --- VADEMÉCUM LINFAR DATA ---
export const linfarCatalog: PeptoneFormula[] = [
    { 
        code: 'APG', 
        name: 'Arteriotrófica Potenciada', 
        ingredients: 'Páncreas, Arterias, Nicotinamida, B6, C', 
        recommendations: 'Arteriosclerosis, metabolismo lipídico, potencia.', 
        description: 'Actúa sobre la pared de los vasos y sobre el metabolismo en general. Produce espasmolisis arterial, recuperación de la permeabilidad selectiva del endotelio vascular, normalización y regulación del metabolismo lipídico. Geriátrico por excelencia. Arteriosclerosis en todas sus formas. Poderoso coadyuvante en impotencia.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ART', 
        name: 'Articular', 
        ingredients: 'Colágeno, Cartílago', 
        recommendations: 'Artrosis, Artritis, Fracturas, Lupus.', 
        description: 'Revitaliza los elementos constitutivos de las articulaciones y el tejido colágeno en general. Indicado en Colagenosis, Artritis reumatoidea, Poliartritis, Lupus eritematoso, Esclerodermia, Artrosis, Artrogénesis imperfecta, Fracturas y Luxaciones.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'BR', 
        name: 'Broncopulmonar', 
        ingredients: 'Tracto Respiratorio', 
        recommendations: 'Asma, Bronquitis, Alergias respiratorias.', 
        description: 'Por su contenido en antígenos totales específicos, estimula la capacidad defensiva en general y específicamente a nivel de las vías respiratorias. Indicado en Bronquitis crónicas, Bronquiectasia, Enfisema pulmonar, Asma bronquial, Coriza, Laringitis crónica, Alergia en general y resfríos a repetición.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'BZ', 
        name: 'Bazo', 
        ingredients: 'Bazo', 
        recommendations: 'Sistema linfático, defensas, Linfomas.', 
        description: 'Regenera y revitaliza el sistema linfático, estimulando la fagocitosis. Indicado para Enfermedades linfáticas, Linfomas, Linfosarcomas (Hodking), y todas las enfermedades en que se encuentra comprometido el estado general.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CG', 
        name: 'Colágeno', 
        ingredients: 'Colágeno', 
        recommendations: 'Tejido conectivo, Celulitis, Flacidez.', 
        description: 'Restaura y revitaliza el tejido conectivo. Ideal para tratamiento de Envejecimiento prematuro, Arterioesclerosis, Cerebro esclerosis, Lupus, Artrosis y Celulitis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CO', 
        name: 'Cardiotrófica', 
        ingredients: 'Corazón, Placenta', 
        recommendations: 'Insuficiencia cardíaca, Post infarto, Rendimiento.', 
        description: 'Actúa sobre el miocardio restaurando y normalizando su función, aumentando el tono y mejorando su rendimiento. Insuficiencia cardíaca, Cardioesclerosis, Angor Péctoris, Recuperación post infarto, Afecciones bronco pulmonares crónicas.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CRB', 
        name: 'Cerebro', 
        ingredients: 'Cerebro', 
        recommendations: 'Memoria, ACV, Depresión, Estrés.', 
        description: 'Personalidad esquizoide, Brotes esquizofrénicos, Psicosis en general, Estados depresivos, Amnesia, Alteraciones del carácter. Fase de recuperación del accidente cerebro-vascular agudo. Síndrome cerebro-vascular mínimo.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CRI', 
        name: 'Cristalino', 
        ingredients: 'Cristalino, Placenta', 
        recommendations: 'Cataratas, Cansancio visual.', 
        description: 'Revitalizante y restaurador tisular del cristalino. Indicado especialmente en cataratas incipientes a severas. En la recuperación de traumatismos oculares. Cansancios o astenias visuales.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CS HEPAT', 
        name: 'Linfar Hepat', 
        ingredients: 'Boldo, Carqueja, Alcachofa', 
        recommendations: 'Protector hepático, Digestión, Vesícula.', 
        description: 'Colerético especial y colagogo. Trastornos digestivos y hepatobiliares. Dispepsias. Protector hepático. Estimulante digestivo. Facilita la expulsión de la bilis retenida en la vesícula biliar. Cefaleas de origen digestivo.',
        presentations: ['Comprimidos', 'Gotas'] 
    },
    { 
        code: 'CU', 
        name: 'Cordón Umbilical', 
        ingredients: 'Cordón Umbilical', 
        recommendations: 'Rejuvenecimiento, Artrosis, Regeneración.', 
        description: 'Rico en gelatina de Wharton. Estímulo condroblástico y osteoblástico. Tejido pluripotencial que actúa mejorando el terreno. Como revitalizante para tonificar el sistema de sostén, dermatoconectivo. Estimula o mejora el aspecto inmunohematológico.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ELT', 
        name: 'Elastina', 
        ingredients: 'Elastina', 
        recommendations: 'Anti arrugas, Elasticidad de la piel.', 
        description: 'Tratamiento del envejecimiento de la piel. Efecto anti arrugas potente. Mejora la actividad metabólica de la piel y devuelve la elasticidad perdida.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ENG', 
        name: 'Energética General', 
        ingredients: 'Suprarrenal, Placenta, Cerebro', 
        recommendations: 'Fatiga crónica, Convalecencia, Memoria.', 
        description: 'Estimula y reactiva los resortes metabólicos de las células. Restaura el equilibrio orgánico. Indicado para involuciones orgánicas, convalecencia, abatimiento psicofísico, inapetencia, disminución del rendimiento intelectual y pérdida de memoria.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ESF', 
        name: 'Energética Sexual Fem', 
        ingredients: 'Placenta, Cerebro, Hipófisis', 
        recommendations: 'Libido, Menopausia, Frigidez.', 
        description: 'Homeostático, reactivador neuroendocrino y revitalizante general femenino. Disminución de la libido. Dispareunia funcional. Anorgasmia. Frigidez. Vejez prematura. Osteoporosis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ESM', 
        name: 'Energética Sexual Masc', 
        ingredients: 'Testículo, Placenta, Cerebro', 
        recommendations: 'Andropausia, Potencia, Energía.', 
        description: 'Reactivador neuroendocrino y revitalizante masculino. Eutrófica general. Andropausia. Disminución de la libido. Vejez prematura. Disfunción erectiva. Eyaculación precoz en hombres de más de 45 años. Eyaculación retardada.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'FLB', 
        name: 'Flebotrófica', 
        ingredients: 'Venas, Hamamelis', 
        recommendations: 'Várices, Piernas cansadas, Hemorroides.', 
        description: 'Tonifica la pared venosa, aumentando su tono y vitalidad. Acelera notablemente la circulación venosa. Várices. Úlceras varicosas. Hemorroides. Hemorroides sangrantes. Telangiectasias. Edemas de origen varicoso. Congestión venosa.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'GI', 
        name: 'Gastrointestinal', 
        ingredients: 'Estómago, Intestino, Placenta', 
        recommendations: 'Gastritis, Colon irritable, Úlceras.', 
        description: 'Normaliza y regula el metabolismo de la pared intestinal, restaurando el equilibrio neurovegetativo y peristaltismo. Gastritis. Duodenitis. Gastroenteritis crónicas. Úlceras gástricas y duodenales. Colon irritable. Diverticulosis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'GL', 
        name: 'Ganglios Linfáticos', 
        ingredients: 'Ganglios', 
        recommendations: 'Defensas bajas, Infecciones recurrentes.', 
        description: 'Estimulante específico del sistema S.R.E. Focos sépticos. Bacteriemia. Inmunodeficiencia en general. Linfoma. Enfermedades infecciosas crónicas como Brucelosis, Chagas, Lepra, Sífilis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'HI', 
        name: 'Hepatotrófica', 
        ingredients: 'Hígado, Placenta', 
        recommendations: 'Hepatitis, Hígado graso, Desintoxicación.', 
        description: 'Cirrosis hepática, insuficiencia hepatocelular. Hepatitis de cualquier etiología. Daño hepatocelular. Gota. Diabetes en general. Insuficiencia cardíaca congestiva. Adinamia neuromuscular. Migraña.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'HIN', 
        name: 'HIN Complex', 
        ingredients: 'Hígado, Cerebro, Corazón', 
        recommendations: 'Autoinmunes, Diabetes, Psoriasis.', 
        description: 'Procesos degenerativos que implican regeneración tisular. Enfermedades autoinmunes. Bioestimulador de los factores que regulan el envejecimiento celular y de los factores de crecimiento. Hepatopatías. Diabetes de la vejez. Leucemias. Hipercolesterolemia.',
        presentations: ['Ampollas'] 
    },
    { 
        code: 'HPF', 
        name: 'Hipófisis', 
        ingredients: 'Hipófisis', 
        recommendations: 'Regulador hormonal, Tiroides, Crecimiento.', 
        description: 'Estimula el metabolismo de los elementos secretorios de la glándula. Disendocrinias. Enanismo hipofisiario. Acromegalia. Vitíligo. Involución endocrina senil. Discromías.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'HPT', 
        name: 'Hipotálamo', 
        ingredients: 'Hipotálamo', 
        recommendations: 'Ansiedad, Sistema nervioso, Apetito.', 
        description: 'Restaura el sistema límbico, normalizando sus funciones. Distonía neurovegetativa. Disendocrinia en general. Esterilidad primaria y secundaria. Anorexia nerviosa.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ID', 
        name: 'Inmuno Desensibilizante', 
        ingredients: 'Bazo, Pulmón, Hígado', 
        recommendations: 'Alergias, Asma, Rinitis.', 
        description: 'Indicado en todos los estados alérgicos. Coadyuvante en el tratamiento del asma. Rinitis crónicas. Alergias alimentarias.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'IE', 
        name: 'Inmuno Estimulante', 
        ingredients: 'Médula Ósea, Ganglios', 
        recommendations: 'Defensas bajas, Anemia.', 
        description: 'Anemias crónicas. Hipoplasia o aplasia medular. Infecciones recurrentes. Pacientes Inmunodeprimidos.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'MCL', 
        name: 'Músculo', 
        ingredients: 'Músculo', 
        recommendations: 'Debilidad muscular, Recuperación deportiva.', 
        description: 'Atonía muscular. Miastenias. Miastenia gravis. Distrofia muscular. Involución muscular. Enfermedades neurológicas heredo-degenerativas. Atrofia senil y por ACV.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'ME', 
        name: 'Médula Espinal', 
        ingredients: 'Médula Espinal', 
        recommendations: 'Sistema nervioso, Impotencia neurógena.', 
        description: 'Revitalizante neuronal. Distrofia muscular. Enfermedades desmielinizantes. Impotencia de origen neurógeno. Descontrol de esfínteres. Síndromes radiculares. Enuresis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'MO', 
        name: 'Médula Ósea', 
        ingredients: 'Médula Ósea', 
        recommendations: 'Anemia, Glóbulos rojos, Plaquetas.', 
        description: 'Regenerador de los elementos figurados de la sangre. Hematopoyético. Displasia medular. Anemias en general. Plaquetopenia. Leucopenia. Leucemia. Alteraciones de la maduración eritrocitaria.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'OJT', 
        name: 'Ojo Total', 
        ingredients: 'Ojo Total, Nervio Óptico', 
        recommendations: 'Visión, Maculopatías.', 
        description: 'Restaura la vitalidad de todas las estructuras del ojo. Normalizador de los defectos de acomodación. Miopías. Úlceras de córnea. Cansancio ocular. Hipermetropías. Retinopatías. Glaucoma. Traumatismos oculares.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'OTF', 
        name: 'Osteotrófica', 
        ingredients: 'Hueso', 
        recommendations: 'Osteoporosis, Fracturas, Calcio.', 
        description: 'Activa los procesos osteoblásticos. Estimula la fijación del calcio y el fósforo. Raquitismo. Aceleración en la producción de callos en fracturas. Osteoporosis. Distrofias óseas. Artrosis.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'OV', 
        name: 'Gonadotrófica Fem', 
        ingredients: 'Ovario, Cerebro', 
        recommendations: 'Ciclo menstrual, Fertilidad.', 
        description: 'Normaliza el metabolismo neuronal y su consiguiente expresión hipotálamo hormonal y neuropsíquico. Pre menopausia. Menopausia. Insomnio. Alteraciones del metabolismo graso. Metrorragias. Dismenorreas. Oligomenorreas. Frigidez.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'OVC', 
        name: 'Homeostática Fem', 
        ingredients: 'Ovario, Tiroides, Suprarrenal', 
        recommendations: 'Equilibrio hormonal mujer, Peso.', 
        description: 'Regulador endocrino total de la mujer joven. Hipoovarismo. Hiper o hipoestrogenismo. Frigidez. Oligomenorrea. Hipomenorrea. Dismenorrea. Endometriosis. Infantilismo genital. Adiposidad.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PAR', 
        name: 'Pro-Osteoarticular', 
        ingredients: 'Hueso, Cartílago, Colágeno', 
        recommendations: 'Articulaciones completas, Dolor.', 
        description: 'Reconstituyente de las articulaciones, el colágeno y los procesos osteoblásticos. Artrogénesis imperfecta. Osteoporosis. Artrosis. Artritis. Poliartritis. Lupus eritematoso. Esclerodermia. Espolón calcáneo.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PCR', 
        name: 'Páncreas', 
        ingredients: 'Páncreas', 
        recommendations: 'Diabetes, Digestión.', 
        description: 'Regenerativo y estimulante de las funciones pancreáticas exocrinas y endocrinas. Espasmolítico del músculo liso. Pancreatitis crónica. Insuficiencia en la digestión de grasas. Enfermedad celíaca. Arteriosclerosis. Litiasis renal. Diabetes.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PEL', 
        name: 'Piel Embrionaria', 
        ingredients: 'Piel, Placenta', 
        recommendations: 'Psoriasis, Vitiligo, Eczemas.', 
        description: 'Eczemas en todas sus formas. Urticarias. Psoriasis. Esclerodermia. Alteraciones nutritivas de la piel. Forunculosis estafilocócicas. Acné juvenil.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PLT', 
        name: 'Placenta', 
        ingredients: 'Placenta', 
        recommendations: 'Revitalizante potente, Anti-age.', 
        description: 'Eutrófico general, revitalizante, estimulante de los procesos cicatrizables. Pre y post operatorio. Senectud. Desnutrición. Caquexia. Disminución de rendimiento físico e intelectual. Enfermedades de la piel en general.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PR', 
        name: 'Próstata', 
        ingredients: 'Próstata, Placenta', 
        recommendations: 'Prostatitis, Salud masculina.', 
        description: 'Prostatitis crónica. Prostatismo senil. Adenoma prostático (sobre todo en su fase inicial). Incontinencia urinaria. Pre y post operatorio del tracto genitourinario masculino.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'PSE', 
        name: 'Psicoestabilizante', 
        ingredients: 'Hipotálamo, Cerebro', 
        recommendations: 'Depresión, Ansiedad, Fobias.', 
        description: 'Trastornos de conducta donde existen componentes depresivos fóbicos u obsesivos. Puede usarse sola o agregada al tratamiento psiquiátrico. Se aconsejan períodos de dos meses de tratamiento con un mes de descanso.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'RE', 
        name: 'Retina', 
        ingredients: 'Nervio Óptico, Retina', 
        recommendations: 'Problemas de retina, Visión.', 
        description: 'En retinopatías de todo tipo y etiología. Angiodisplasias retinianas. Esclerosis. Retinitis. Neuritis oftálmica. Trombosis y Hemorragias retinianas. Visión nocturna deficiente.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'RN', 
        name: 'Riñón', 
        ingredients: 'Riñón', 
        recommendations: 'Insuficiencia renal, Cálculos.', 
        description: 'Protector del nefrón. Hiperuricemia. Glomerulonefritis crónica. Nefrosis. Nefroesclerosis. Nefritis focal. Lupus sistémico. Hipertensión arterial. Edemas renales. Pielonefritis crónica. Litiasis renal.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'SOY', 
        name: 'Soja', 
        ingredients: 'Soja', 
        recommendations: 'Colesterol, Menopausia.', 
        description: 'Excelente coadyuvante para incrementar los niveles de lipoproteína de alta densidad (HDL). Disminuye el riesgo de cardiopatías. Ordenador neurovegetativo. Premenopausia y posmenopausia. Diabetes. Obesidad. Hipertensión.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'SRR', 
        name: 'Suprarrenal Total', 
        ingredients: 'Suprarrenal, Hipotálamo', 
        recommendations: 'Estrés, Fatiga adrenal, Asma.', 
        description: 'Eutrófico específico. Restaura la vitalidad de los elementos secretorios de las glándulas, en hiper o hipofunción. Carece de efecto adrenérgico. Cushing. Addison. Corticoterapia. Post corticoterapia. Hirsutismo. Enfermedades autoinmunes.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'TE', 
        name: 'Testículo', 
        ingredients: 'Testículo, Cerebro', 
        recommendations: 'Potencia, Fertilidad masculina.', 
        description: 'Insuficiencia endocrina testicular. Alteraciones de la esparmatogénesis. Disminución de la libido. Impotencia. Depresiones sexuales. Trastornos de la eyaculación. Andropausia.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'TEC', 
        name: 'Homeostático Masc', 
        ingredients: 'Testículo, Tiroides, Suprarrenal', 
        recommendations: 'Equilibrio hormonal hombre.', 
        description: 'Regulador endocrino total masculino. Andropausia. Hiper o hipotestosteronemia. Infantilismo genital. Inestabilidad de carácter. Depresión. Nivel de energía reducido. Somnolencia. Impotencia sexual.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'TM', 
        name: 'Timo', 
        ingredients: 'Timo', 
        recommendations: 'Defensas, Inmunidad.', 
        description: 'Estimulante inespecífico del sistema inmunológico. Homeostático tisular. Tumores benignos y malignos. Enfermedades autoinmunes y degenerativas. Retardo del crecimiento en los niños.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'TM PLUS', 
        name: 'Revitalizante Inmuno', 
        ingredients: 'Timo, Bazo, Ganglios', 
        recommendations: 'Defensas máximas, Oncología.', 
        description: 'Sistema inmunológico completo. Estimulante inespecífico del sistema inmunológico. Tumores benignos y malignos. Enfermedades autoinmunes y degenerativas. Hematopoyético. Anemias en general. Infecciones recurrentes.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'TR', 
        name: 'Tiroides', 
        ingredients: 'Tiroides, Hipotálamo', 
        recommendations: 'Hipotiroidismo, Metabolismo.', 
        description: 'Eutrófico específico. Restaura la vitalidad de los elementos secretorios de las glándulas, regulando y normalizando la función de las mismas. Mixedema. Hipo e hipertiroidismo subclínicos. Bocio. Obesidad.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'VBI', 
        name: 'Vías Biliares', 
        ingredients: 'Vías Biliares, Hígado', 
        recommendations: 'Digestión, Vesícula.', 
        description: 'Actúa sobre la vesícula, vías biliares, esfínter de Oddi y duodeno, restaurándolos y revitalizándolos. Estimula la función hepática. Colerético. Colagogo. Disquinesia biliar. Litiasis biliar.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'VE', 
        name: 'Venas', 
        ingredients: 'Venas, Placenta', 
        recommendations: 'Circulación, Várices.', 
        description: 'Tonifica la pared venosa mejorando notablemente la circulación. Várices. Trombosis varicosas. Tromboflebitis. Úlceras varicosas. Hemorroides.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    },
    { 
        code: 'VG', 
        name: 'Vejiga', 
        ingredients: 'Vejiga', 
        recommendations: 'Cistitis, Incontinencia.', 
        description: 'Revitaliza la pared vesical y restaura la mucosa. Pólipos de vejiga. Cistitis crónica. Incontinencia urinaria. Polaquiuria. Prolapso uretral. Prostatitis. Adenoma Prostático.',
        presentations: ['Ampollas', 'Comprimidos', 'Gotas'] 
    }
];

export const initialSiteContent: SiteContent = {
  sportsHeroTitle1: "ALTO",
  sportsHeroTitle2: "RENDIMIENTO",
  sportsHeroDescription: "Elegí avanzar con seguridad, sin riesgos ni falsas promesas. Natural. Seguro. Efectivo.",
  logoInforma: "",
  sportsHeroBg: "",
  
  beautyHeroTitle1: "Belleza que nace",
  beautyHeroTitle2: "desde adentro",
  beautyHeroDescription: "Fórmulas diseñadas para actuar desde el interior de cada célula. Ciencia y naturaleza en perfecto equilibrio.",
  logoPhisis: "",
  beautyHeroBg: "",
  
  fragranceHeroTitle1: "Tu misma",
  fragranceHeroTitle2: "Esencia",
  fragranceHeroDescription: "Fragancias genderless y cuidado personal que conectan con quien realmente sos. Sin etiquetas, solo aroma.",
  logoIqual: "",
  fragranceHeroBg: "",

  bioHeroTitle1: "Ciencia y Naturaleza",
  bioHeroTitle2: "para una Salud Integral",
  bioHeroDescription: "Nutrición biológica y genética de vanguardia. Restauramos el equilibrio orgánico desde el núcleo celular.",
  logoBiofarma: "",
  bioHeroBg: ""
};

export const initialContactInfo: ContactInfo = {
  email: "contacto@informa-phisis.com",
  phone: "+54 9 11 1234 5678",
  address: "Av. Corrientes 1234, Buenos Aires",
  instagram: "@iqualargentina"
};

export const initialPaymentConfig: PaymentConfig = {
    cash: { enabled: true },
    card: { enabled: true },
    transfer: { 
        enabled: true, 
        alias: "INFORMA.PHISIS.MP", 
        cbu: "0000003100000000000000", 
        bankName: "Mercado Pago",
        holderName: "In Forma S.A."
    }
};

export const initialSocialReviews: SocialReview[] = [
    {
        id: 'rev-1',
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=300&auto=format&fit=crop', 
        brand: 'informa'
    },
    {
        id: 'rev-2',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=300&auto=format&fit=crop', 
        brand: 'phisis'
    },
    {
        id: 'rev-3',
        imageUrl: 'https://images.unsplash.com/photo-1542038784424-48ed221735c3?q=80&w=300&auto=format&fit=crop', 
        brand: 'iqual'
    },
    {
        id: 'rev-4',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop', 
        brand: 'biofarma'
    }
];

export const initialProducts: Product[] = [
  // --- IN FORMA (Sports) ---
  {
    id: 'IF-001',
    name: 'Max Training',
    brand: 'informa',
    category: 'Alto Rendimiento',
    price: 18500,
    description: 'Bebida completa hidratante y energizante.',
    longDescription: 'Diseñado para atletas de alto rendimiento, Max Training combina electrolitos esenciales con una matriz de carbohidratos de liberación sostenida. Ideal para consumir durante entrenamientos intensos para retrasar la fatiga y evitar calambres.',
    image: '/images/products/max-training.jpg',
    features: ['Hidratación', 'Energía', 'Recuperación'],
    stock: 50,
    active: true
  },
  {
    id: 'IF-002',
    name: 'Creat Plus',
    brand: 'informa',
    category: 'Alto Rendimiento',
    price: 15200,
    description: 'Creatina de alta pureza con carbohidratos.',
    longDescription: 'Nuestra fórmula micronizada asegura una absorción un 30% más rápida que la creatina monohidrato estándar. Potenciada con taurina para mejorar el enfoque mental durante el levantamiento de pesas.',
    image: '/images/products/creat-plus.jpg',
    features: ['Fuerza', 'Volumen', 'Resistencia'],
    stock: 30,
    active: true
  },
  {
    id: 'IF-003',
    name: 'Pro Slim',
    brand: 'informa',
    category: 'Adelgazantes',
    price: 14500,
    description: 'Slim Balance: bajar de peso sin pasar hambre.',
    longDescription: 'Contiene Peptine®, un exclusivo complejo de péptidos bioactivos que actúan sobre el centro de saciedad. Acompañado de extracto de té verde y L-carnitina para potenciar la quema de grasas en reposo.',
    image: '/images/products/pro-slim.jpg',
    features: ['Control Apetito', 'Quema Grasa', 'Sin Rebote'],
    stock: 15,
    active: true
  },
  {
    id: 'IF-004',
    name: 'High Fuel',
    brand: 'informa',
    category: 'Alto Rendimiento',
    price: 13800,
    description: 'Bebida isotónica de rápida absorción.',
    longDescription: 'La solución definitiva para la rehidratación post-competencia. Restaura los niveles de glucógeno muscular y repone sales minerales perdidas por el sudor en tiempo récord.',
    image: '/images/products/high-fuel.jpg',
    features: ['Isotónico', 'Rápida Absorción', 'Anti-Fatiga'],
    stock: 100,
    active: true
  },
  {
    id: 'IF-006',
    name: 'Whey Protein PRO',
    brand: 'informa',
    category: 'Alto Rendimiento',
    price: 22000,
    description: 'Proteína de suero de leche 80%.',
    longDescription: 'Obtenida mediante ultrafiltración a bajas temperaturas para preservar la estructura proteica. Cada scoop aporta 24g de proteína neta y 5.5g de BCAAs, fundamental para la reparación de tejidos.',
    image: '/images/products/whey-pro.jpg',
    features: ['80% Pureza', 'Masa Muscular', 'Sabor Premium'],
    stock: 25,
    active: true
  },

  // --- PHISIS (Beauty) ---
  {
    id: 'PH-001',
    name: 'Pro NAD+ Resveratrol',
    brand: 'phisis',
    category: 'Nutricosmética',
    price: 25000,
    description: 'Nutrición Celular Inteligente.',
    longDescription: 'El secreto de la juventud celular. Combina precursores de NAD+ con Resveratrol puro para activar las sirtuinas (genes de la longevidad). Mejora visiblemente la textura de la piel y reduce líneas de expresión en 4 semanas.',
    image: '/images/products/pro-nad.jpg',
    features: ['Longevidad', 'Antioxidante', 'Energía Celular'],
    stock: 40,
    active: true
  },
  {
    id: 'PH-002',
    name: 'Bionutrients HAIR',
    brand: 'phisis',
    category: 'Nutricosmética',
    price: 19500,
    description: 'Fortaleza y vitalidad desde la raíz.',
    longDescription: 'Un cocktail de biotina, zinc, hierro y aminoácidos azufrados que nutren el folículo piloso desde adentro. Clínicamente probado para aumentar el grosor del cabello y detener la caída estacional.',
    image: '/images/products/hair.jpg',
    features: ['Anti-Caída', 'Brillo', 'Volumen'],
    stock: 20,
    active: true
  },
  {
    id: 'PH-004',
    name: 'Peeling Crystal',
    brand: 'phisis',
    category: 'Cuidado Piel',
    price: 16500,
    description: 'Exfoliación natural con cristales de cuarzo.',
    longDescription: 'Microdermoabrasión en casa. Elimina células muertas y estimula la producción de colágeno nuevo. Su base de crema hidratante asegura que la piel quede suave, no tirante, después del uso.',
    image: '/images/products/peeling.jpg',
    features: ['Renovación', 'Suavidad', 'Luminosidad'],
    stock: 12,
    active: true
  },

  // --- IQUAL (Fragancias y Cuidado) ---
  {
    id: 'IQ-047',
    name: 'IQUAL N°47',
    brand: 'iqual',
    category: 'Fragancias',
    price: 21000,
    description: 'Neutral Gender. Notas frescas y verdes.',
    longDescription: 'Una fragancia que rompe moldes. Salida cítrica de bergamota, corazón de té verde y fondo de almizcle blanco. Diseñada para perdurar todo el día sin invadir el espacio personal.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
    features: ['Floral Verde', 'Almizcle', 'Profesional'],
    stock: 20,
    active: true
  },
  {
    id: 'IQ-034',
    name: 'IQUAL N°34',
    brand: 'iqual',
    category: 'Fragancias',
    price: 21000,
    description: 'Amaderada Especiada.',
    longDescription: 'Intensa y seductora. Combina la calidez de la madera de oud con el picante de la pimienta rosa. Ideal para la noche o momentos donde quieras dejar huella.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop',
    features: ['Festivo', 'Amaderado', 'Especiado'],
    stock: 15,
    active: true
  },
  {
    id: 'IQ-BS01',
    name: 'Body Splash Green',
    brand: 'iqual',
    category: 'Cuidado Corporal',
    price: 10200,
    description: 'Frescura instantánea.',
    longDescription: 'Bruma corporal enriquecida con Aloe Vera. Refresca la piel al instante y deja un sutil aroma a pepino y melón. Perfecta para después de la ducha o el gimnasio.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    features: ['Refrescante', 'Diario', 'Liviano'],
    stock: 50,
    active: true
  },

  // --- BIOFARMA NATURAL (Salud Integral) ---
  {
    id: 'BIO-002',
    name: 'GenLife',
    brand: 'biofarma',
    category: 'Revitalización',
    price: 32500,
    description: 'Complejo de Revitalización Celular.',
    longDescription: 'Terapia biológica oral. Utiliza extractos embrionarios para estimular las funciones vitales del organismo. Recomendado para fatiga crónica y recuperación post-quirúrgica.',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=600&auto=format&fit=crop',
    features: ['Anti-Age', 'Energía', 'Nucleótidos'],
    stock: 60,
    active: true
  },
  {
    id: 'BIO-003',
    name: 'Bionutrients Forte',
    brand: 'biofarma',
    category: 'Salud Integral',
    price: 24000,
    description: 'Mantené el equilibrio orgánico.',
    longDescription: 'Multivitamínico de origen natural con alta biodisponibilidad. Refuerza el sistema inmunológico gracias a su alta concentración de Vitamina C, D3 y Zinc quelado.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=600&auto=format&fit=crop',
    features: ['Inmunidad', 'Equilibrio', 'Vitamina C+D'],
    stock: 85,
    active: true
  },
  {
    id: 'BIO-004',
    name: 'NúcleoCell',
    brand: 'biofarma',
    category: 'Genética',
    price: 45000,
    description: 'Nutrición genética de vanguardia.',
    longDescription: 'Suplemento a base de Polinucleótidos (fragmentos de ADN/ARN) que actúan como "ladrillos" para la reparación rápida del ADN celular dañado por el estrés oxidativo y la edad.',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=600&auto=format&fit=crop',
    features: ['ADN', 'Polinucleótidos', 'Vanguardia'],
    stock: 20,
    active: true
  }
];

export const initialBanners: Banner[] = [
    {
        id: 'B-001',
        title: 'PACK FUERZA TOTAL',
        description: 'Llevá tu entrenamiento al límite con Max Training + Whey Protein. ¡15% OFF en el pack!',
        image: '/images/banners/banner-sports.jpg',
        brand: 'informa',
        active: true,
        discountPercentage: 15,
        relatedProducts: [
            { productId: 'IF-001', quantity: 1, discountPercentage: 15 },
            { productId: 'IF-006', quantity: 1, discountPercentage: 15 },
        ]
    },
    {
        id: 'B-002',
        title: 'RUTINA GLOW',
        description: 'Renová tu piel con nuestro Peeling Crystal. Envío gratis.',
        image: '/images/banners/banner-beauty.jpg',
        brand: 'phisis',
        active: true,
        discountPercentage: 0,
        relatedProducts: [
            { productId: 'PH-004', quantity: 1 }
        ]
    },
    {
        id: 'B-003',
        title: 'TU MISMA ESENCIA',
        description: 'Descubrí la nueva colección de fragancias Gender Neutral. IQUAL N°47.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
        brand: 'iqual',
        active: true,
        discountPercentage: 10,
        relatedProducts: [
            { productId: 'IQ-047', quantity: 1, discountPercentage: 10 }
        ]
    },
    {
        id: 'B-004',
        title: 'NUEVA ERA GENÉTICA',
        description: 'NúcleoCell: La máxima potencia en regeneración a través de polinucleótidos.',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop',
        brand: 'biofarma',
        active: true,
        discountPercentage: 0,
        relatedProducts: [
            { productId: 'BIO-004', quantity: 1 }
        ]
    }
];

// --- CORRECTED INITIAL RESELLERS ---
// Ahora el stock inicial de los revendedores se inicializa en 0 para cada producto
export const initialResellers: Reseller[] = [
    {
        id: 'R-001',
        name: 'Distribuidora Norte',
        email: 'vendedor@informa.com',
        password: '1234',
        region: 'Zona Norte',
        active: true,
        stock: initialProducts.map(p => ({ ...p, stock: 0 })), // Stock en 0, no copia del admin
        clients: [
            {
                id: 'C-001',
                name: 'Gimnasio Iron Man',
                phone: '11-5555-4444',
                address: 'Calle Falsa 123',
                paymentMethod: 'Transferencia',
                currentAccountBalance: -50000, 
                lastOrderDate: '2023-10-15'
            }
        ],
        orders: [],
        sales: [],
        messages: [],
        points: 1250
    }
];

export const initialAdminClients: Client[] = [
    {
        id: 'AC-001',
        name: 'Farmacia Central',
        phone: '11-1234-5678',
        address: 'Av. Corrientes 2000',
        paymentMethod: 'Transferencia',
        currentAccountBalance: 150000,
        lastOrderDate: '2023-11-10'
    }
];