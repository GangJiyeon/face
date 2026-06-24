export interface IngredientNote {
  name: string
  benefit: string
}

export interface SkinTypeData {
  title: string
  tagline: string
  overview: string[]
  characteristics: string[]
  causes: string[]
  morningRoutine: string[]
  eveningRoutine: string[]
  keyIngredients: IngredientNote[]
  avoidIngredients: IngredientNote[]
  lifestyleTips: string[]
}

export interface ScoreModifier {
  id: string
  color: string
  title: string
  body: string
  tips: string[]
}

export const SKIN_TYPE_INFO: Record<string, SkinTypeData> = {
  dry: {
    title: "Dry Skin",
    tagline: "Your skin is thirsty — moisture retention is the key to everything.",
    overview: [
      "Dry skin occurs when your skin's moisture barrier is compromised, making it difficult to retain water. The outermost layer of your skin, the stratum corneum, contains fewer natural moisturizing factors (NMFs) and lipids than optimal, leading to that characteristic tight, rough feeling — especially noticeable right after cleansing or stepping out into cold air.",
      "Unlike dehydrated skin, which is a temporary state caused by lack of water intake, dry skin is a persistent skin type determined largely by genetics and sebaceous gland activity — your skin simply produces less sebum than average. Without a consistent, barrier-focused skincare routine, the skin surface progressively becomes flaky, dull, and more vulnerable to environmental damage and premature fine lines.",
      "The encouraging reality is that dry skin responds exceptionally well to the right combination of moisturizing ingredients. People with dry skin tend to have naturally smaller, minimally visible pores and a finer skin texture. With proper layered hydration and the right occlusive ingredients to lock moisture in, dry skin can become genuinely smooth, supple, and radiant.",
    ],
    characteristics: [
      "Tight or uncomfortable sensation, especially after cleansing, swimming, or prolonged sun exposure",
      "Visible flaking, rough patches, or fine peeling — typically concentrated around the nose, brows, and cheeks",
      "Dull, lackluster complexion caused by a build-up of dead skin cells that aren't naturally shedding",
      "Fine lines appear more pronounced and visible, as dryness accentuates surface texture irregularities",
      "Small, minimally visible pores — one of the notable upsides of dry skin",
      "Heightened sensitivity to temperature changes, cold wind, and low-humidity environments like airplane cabins",
      "Makeup tends to cling to dry patches and may crack or look patchy within a few hours of application",
    ],
    causes: [
      "Genetics: the number and activity level of sebaceous glands is largely inherited and determines baseline oil production",
      "Aging: sebum production naturally declines with age — skin in your 30s produces significantly less oil than it did at 20",
      "Environmental factors: cold weather, low humidity, dry wind, and indoor heating or air conditioning all accelerate moisture evaporation from the skin surface",
      "Over-cleansing: using harsh surfactant-heavy cleansers or washing more than twice a day strips the natural lipid barrier that prevents water loss",
      "Hot water exposure: long hot showers or baths dissolve the protective lipid layer, leading to immediate tightness and long-term barrier disruption",
      "Certain medications or health conditions: diuretics, antihistamines, acne medications (especially retinoids), and conditions like hypothyroidism or eczema directly impact skin moisture",
      "Nutritional factors: insufficient intake of healthy fats — omega-3 and omega-6 fatty acids — affects skin lipid production from the inside out",
    ],
    morningRoutine: [
      "Gentle cream or milk cleanser — avoid all foaming cleansers containing sulfates (SLS/SLES), which strip the barrier even with a quick rinse",
      "Hydrating toner or first essence containing hyaluronic acid, glycerin, or fermented ingredients — apply to damp skin for best absorption",
      "Hydrating serum with layered humectants (hyaluronic acid in multiple molecular weights) to saturate the skin with water from deeper layers",
      "Rich moisturizer with occlusive ingredients like shea butter, squalane, or dimethicone to seal all the hydration in",
      "SPF 30+ sunscreen — UV radiation accelerates transepidermal water loss and degrades the moisture barrier; choose a moisturizing lotion-formula sunscreen",
    ],
    eveningRoutine: [
      "Oil-based or balm cleanser to gently dissolve sunscreen and makeup without removing the skin's natural oils",
      "Gentle cream cleanser for the second cleanse — no foam, no heat, no harsh rubbing",
      "Hydrating toner or fermented essence patted in generously — this is your biggest hydration deposit of the day",
      "Peptide or ceramide serum in the evening — peptides signal the skin to repair and produce collagen during the overnight regeneration window",
      "Rich night cream or sleeping mask containing shea butter, ceramides, fatty acids, and squalane — apply slightly more than you think you need",
      "Facial oil as a final occlusive layer (optional but highly effective) — rosehip, marula, or jojoba oil forms a breathable film that locks everything in overnight",
    ],
    keyIngredients: [
      { name: "Hyaluronic Acid", benefit: "Draws water molecules from the environment and deeper skin layers into the surface — each molecule can hold 1000× its weight in water" },
      { name: "Ceramides", benefit: "Essential lipids that make up ~50% of the skin barrier; replenish the 'mortar' between skin cells that prevents moisture escape" },
      { name: "Glycerin", benefit: "Powerful humectant that attracts and binds water to the skin surface; highly effective even in low-humidity conditions" },
      { name: "Squalane", benefit: "Lightweight plant-derived oil (from olives or sugarcane) that closely mimics the skin's own natural lipids without feeling greasy" },
      { name: "Peptides", benefit: "Signal peptides trigger collagen and elastin synthesis; barrier peptides directly reinforce the lipid structure of the stratum corneum" },
      { name: "Shea Butter", benefit: "Rich emollient with a near-perfect balance of oleic and stearic fatty acids that softens, seals, and deeply nourishes very dry skin" },
      { name: "Niacinamide", benefit: "Strengthens the skin barrier by stimulating ceramide production, reduces transepidermal water loss, and improves skin texture over time" },
    ],
    avoidIngredients: [
      { name: "Denatured Alcohol (Alcohol Denat.)", benefit: "Rapidly strips skin moisture and disrupts the lipid barrier — even short-term use causes measurable barrier damage in dry skin types" },
      { name: "Synthetic Fragrance", benefit: "Common irritant and barrier disruptor; dry skin with a weakened barrier is significantly more vulnerable to fragrance-related reactions" },
      { name: "Strong AHAs (high concentration)", benefit: "Chemical exfoliants accelerate cell turnover but require an intact, well-hydrated barrier to avoid irritation — use only after moisturizing" },
      { name: "Sulfate Cleansers (SLS/SLES)", benefit: "The most stripping cleansing agents available; a single use removes the natural lipid film that dry skin desperately needs to retain" },
      { name: "Retinol (when starting)", benefit: "Initially causes purging dryness and peeling in most users; always introduce retinol slowly with a rich moisturizer buffering technique for dry skin types" },
    ],
    lifestyleTips: [
      "Run a humidifier in your bedroom while sleeping — maintaining 40–60% relative humidity dramatically reduces overnight moisture loss from the skin surface",
      "Apply your moisturizer while skin is still slightly damp after cleansing, within 60 seconds — this is the single most effective timing tip for dry skin",
      "Prioritize dietary omega-3 and omega-6 fats: fatty fish, walnuts, flaxseed, and avocado support skin lipid production from the inside",
      "Keep showers short (5–10 minutes max) and use lukewarm — not hot — water; heat dissolves the surface lipid layer faster than anything else",
      "Use a gentle weekly exfoliation (enzyme-based or very low-concentration AHA) to clear the dead cell layer that blocks moisture absorption",
      "Layer your skincare by molecular weight: thinnest and most watery products first, richest and most occlusive last — this is called the 'sandwich method'",
      "Swap all facial towels for soft microfiber cloths or simply pat — never rub — as friction accelerates barrier disruption on already compromised dry skin",
    ],
  },

  oily: {
    title: "Oily Skin",
    tagline: "Your skin is alive and active — the goal is balance, not elimination.",
    overview: [
      "Oily skin is defined by overactive sebaceous glands that produce more sebum than the skin's surface requires. Sebum itself is not the enemy — it's a complex mixture of lipids that maintains the skin's pH balance, provides a natural antimicrobial barrier, and keeps the skin supple without external moisturizers. The problem arises when sebum production exceeds what the skin can utilize, creating a persistent shine, visibly enlarged pores, and a hospitable environment for acne-causing bacteria.",
      "One of the most counterintuitive truths about oily skin is that stripping it aggressively makes it oilier. When harsh cleansers or astringents deplete the skin's moisture, sebaceous glands interpret this as dryness and upregulate oil production in a compensatory rebound response. This is why proper — though lightweight — hydration is non-negotiable even for the oiliest skin types. Fighting oil with oil-control products alone often creates a cycle that worsens the problem.",
      "The silver linings of oily skin are significant and often underappreciated. Natural sebum contains squalene, wax esters, and free fatty acids that function as a built-in anti-aging defense. People with oily skin consistently show fewer and later-onset fine lines and wrinkles. With the right targeted routine focused on balance rather than elimination, oily skin can be one of the most resilient, youthful-aging skin types.",
    ],
    characteristics: [
      "Persistent, greasy shine appearing within 1–2 hours of cleansing, particularly in the T-zone (forehead, nose, chin)",
      "Visibly enlarged pores, especially around the nose and across the cheeks, caused by sebum stretching the follicle walls",
      "Frequent blackheads (open comedones) and whiteheads (closed comedones) where oxidized sebum plugs pores",
      "Prone to inflammatory acne — papules, pustules, and occasionally cystic lesions — as sebum feeds Cutibacterium acnes bacteria",
      "Makeup slides, shifts, or disappears within hours without a primer and setting spray",
      "Skin may feel thick, coarse, or have a slightly rough texture from sebum accumulation",
      "Paradoxically, oily skin can feel both greasy and dehydrated simultaneously — oil and water are independent systems",
    ],
    causes: [
      "Genetics: sebaceous gland density and androgen sensitivity are largely inherited — if your parents had oily skin, you likely will too",
      "Hormones: androgens (testosterone, DHEA, DHT) directly stimulate sebaceous gland size and secretion — explaining oiliness spikes during puberty, menstruation, pregnancy, and high-stress periods",
      "Diet: high glycemic index foods (refined carbohydrates, sugar, white rice) spike insulin and IGF-1, both of which upregulate sebum production within hours of consumption",
      "Over-stripping: using harsh sulfate cleansers or astringent toners depletes surface lipids, triggering a feedback rebound that increases oil output",
      "Climate: warm, humid environments directly increase sebum secretion — skin in tropical summers produces significantly more oil than in temperate winters",
      "Inadequate hydration: paradoxically, not moisturizing leads to more sebum as the skin attempts to compensate for perceived dryness",
      "Certain medications: corticosteroids (topical or oral), some antidepressants, and hormonal contraceptives with high progestin content can alter sebum production significantly",
    ],
    morningRoutine: [
      "Gentle gel or low-foam cleansing foam — effective enough to remove overnight sebum, mild enough not to trigger rebound oil production",
      "Balancing hydrating toner with niacinamide or green tea — avoid any toner with alcohol as the primary ingredient",
      "Water-based serum with niacinamide (5–10%) — the gold standard for oily skin; regulates sebum, minimizes pore appearance, and strengthens the barrier simultaneously",
      "Oil-free gel moisturizer — light, non-comedogenic, and essential even for the oiliest skin; look for water-gel or aloe-gel textures",
      "Mattifying or fluid SPF 30+ sunscreen with a dry finish — silica or rice powder-based formulas work well; gel sunscreens are another excellent option",
    ],
    eveningRoutine: [
      "Oil cleanser or micellar water to first dissolve sunscreen and makeup — oil emulsifies oil effectively without stripping the barrier",
      "BHA (salicylic acid 0.5–2%) cleanser for the second cleanse — salicylic acid is oil-soluble and penetrates inside pores to dissolve sebum plugs from within",
      "Niacinamide or azelaic acid treatment serum — apply across the entire face for ongoing sebum regulation and pore refining",
      "BHA toner or AHA serum 2–3 nights per week for chemical exfoliation — removes the dead cell layer that mixes with sebum to form comedones",
      "Lightweight gel moisturizer or water-sleeping pack as the final step — never skip moisturizer; even oily skin needs overnight hydration support",
    ],
    keyIngredients: [
      { name: "Niacinamide (Vitamin B3)", benefit: "Clinically proven to reduce sebum production, minimize the appearance of enlarged pores, and strengthen the barrier — all simultaneously" },
      { name: "Salicylic Acid (BHA)", benefit: "Uniquely oil-soluble beta-hydroxy acid that penetrates deep into pores and dissolves the sebum-dead cell mixture that causes blackheads and acne" },
      { name: "Zinc PCA", benefit: "Regulates sebaceous gland activity, has mild antibacterial properties against acne-causing bacteria, and reduces pore-clogging without drying" },
      { name: "Tea Tree Oil", benefit: "Natural antimicrobial and anti-inflammatory agent that reduces surface bacteria and calms active breakouts — always diluted in finished formulas" },
      { name: "AHAs (Glycolic, Lactic Acid)", benefit: "Water-soluble exfoliants that clear the surface dead cell layer, improving texture and preventing the cellular buildup that feeds comedone formation" },
      { name: "Kaolin / Bentonite Clay", benefit: "Mineral clays with powerful sebum-absorbing capacity; used in masks and some cleansers to physically pull excess oil out of pores" },
      { name: "Retinol", benefit: "Regulates cell turnover, prevents comedone formation, and over time reduces the sebaceous gland activity — a long-term game changer for oily skin" },
    ],
    avoidIngredients: [
      { name: "Heavy Comedogenic Oils (Coconut, Cocoa Butter)", benefit: "High comedogenic rating means these clog pores in most oily skin types — despite being natural, they are among the worst choices for sebum-prone skin" },
      { name: "Mineral Oil / Petrolatum (as primary moisturizer)", benefit: "Excellent occlusives for dry skin but suffocating for oily skin — create a film that prevents sebum release and can worsen congestion" },
      { name: "Alcohol-Heavy Astringents", benefit: "Provide a temporarily matte effect but destroy the surface barrier, triggering the rebound oil production cycle within hours" },
      { name: "Rich Cream Moisturizers", benefit: "Designed for dry skin; applied to oily skin they over-saturate the barrier and block sebum pathways, directly contributing to comedone formation" },
    ],
    lifestyleTips: [
      "Change your pillowcase 2–3 times per week — a single night deposits enough oil and bacteria on fabric to meaningfully re-contaminate your cleansed skin",
      "Use blotting papers for daytime touch-ups rather than loose powder — papers physically absorb oil without adding layering weight that can eventually clog pores",
      "Reduce high-glycemic foods in your diet — white bread, white rice, refined sugar, and processed snacks spike insulin which directly stimulates sebum production within hours",
      "Exercise regularly and consistently — it improves insulin sensitivity, reduces cortisol levels, and helps regulate the hormonal signals that drive excess sebum",
      "Keep your hands away from your face throughout the day — sebum and bacteria from your hands are among the most direct contributors to breakouts",
      "Use separate, dedicated face towels and wash them every 2–3 days — kitchen or body towels harbor bacteria and mold that recontaminate cleansed skin",
      "Never go to sleep without double cleansing — overnight sebum oxidizes into blackheads and provides fuel for acne bacteria throughout the night",
    ],
  },

  sensitive: {
    title: "Sensitive Skin",
    tagline: "Your skin speaks loudly — listen carefully and keep it calm.",
    overview: [
      "Sensitive skin is not a single condition but rather a state of heightened skin reactivity that can emerge from multiple underlying causes. The most common is a compromised or thin skin barrier — when the lipid-rich stratum corneum is damaged or underdeveloped, irritants, allergens, and microorganisms penetrate more easily into the deeper dermis, triggering an immune response that manifests as visible redness, stinging, burning, or itching.",
      "True sensitive skin is often clinically associated with rosacea, atopic dermatitis (eczema), or contact dermatitis, but a large proportion of people experience functional sensitivity without a formal diagnosis. Environmental triggers — temperature extremes, UV radiation, pollution, stress, and synthetic fragrances — are among the most consistent culprits. Paradoxically, the modern skincare culture of using multiple active ingredients simultaneously has dramatically increased the prevalence of acquired sensitivity.",
      "Effective management of sensitive skin requires a philosophy of subtraction rather than addition. Fewer ingredients, gentler actives, and an unwavering focus on repairing and protecting the barrier are the pillars. When the barrier is strong, much of the sensitivity naturally resolves on its own. This is why the best sensitive skin routines often look deceptively simple — they are deliberately so.",
    ],
    characteristics: [
      "Visible redness, flushing, and broken capillaries near the surface, particularly across the nose, cheeks, and chin",
      "Burning, tingling, or stinging sensation when applying products — even those labeled 'gentle' or 'fragrance-free'",
      "Itching and tightness after exposure to temperature extremes, cold wind, or changes in humidity",
      "Skin reacts noticeably and disproportionately to certain triggers: spicy foods, alcohol, hot drinks, sun exposure, and emotional stress",
      "Prone to contact reactions — rashes, hives, or localized swelling when new products are introduced without patch testing",
      "Blotchy, uneven complexion with patches of redness alongside normal-toned areas, often fluctuating throughout the day",
      "Existing irritation keeps the barrier perpetually weakened, creating a cycle where even previously-tolerated products begin to cause reactions",
    ],
    causes: [
      "Compromised skin barrier: insufficient ceramides and lipids in the stratum corneum allow irritants and allergens to penetrate that should be physically excluded",
      "Genetic predisposition: fair-skinned individuals, those with Northern European ancestry, and people with family history of eczema, rosacea, or allergic asthma are statistically more prone",
      "Over-exfoliation: excessive or too-frequent use of AHAs, BHAs, retinoids, or physical scrubs destroys the lipid mortar between skin cells, rapidly breaking down the barrier",
      "Inappropriate cleansing: sulfate-heavy cleansers alter the skin's natural pH and remove the lipid layer — even brief exposure causes measurable barrier disruption in sensitive skin",
      "Fragrance sensitivity: synthetic and even many natural fragrances are among the most prevalent contact allergens in personal care products — it's the single most common reason for cosmetic dermatitis",
      "Accumulated UV damage: repeated unprotected sun exposure progressively thins the dermis, depletes antioxidant reserves, and creates chronic low-grade inflammation",
      "Stress and hormonal shifts: elevated cortisol increases skin permeability, triggers mast cell activation, and impairs the barrier's natural repair mechanisms — explaining flare-ups during exams, deadlines, and hormonal events",
    ],
    morningRoutine: [
      "Gentle rinse with lukewarm water only — or a very mild cream cleanser with no surfactants; morning cleansing is often optional and may be unnecessary for sensitive skin",
      "Calming, alcohol-free toner with centella asiatica, beta-glucan, or aloe vera — apply by gently pressing, never rubbing, to avoid physical friction",
      "Minimal actives: a simple antioxidant — low-concentration vitamin C (5–10%) or a green tea extract serum — provides protection against environmental damage without the risk of higher-potency actives",
      "Ceramide-rich moisturizer to reinforce the barrier before exposure to environmental stressors",
      "Mineral sunscreen (zinc oxide or titanium dioxide) — physical filters sit on top of the skin rather than penetrating, making them significantly less irritating than chemical UV filters for most sensitive skin types",
    ],
    eveningRoutine: [
      "Micellar water or a fragrance-free, oil-based cleanser applied with light pressure — no rubbing, no hot water, no washcloth friction",
      "Very gentle cream cleanser for the second cleanse if makeup was worn; skip entirely on low-exposure days",
      "Calming essence or serum with centella asiatica, madecassoside, panthenol (B5), or tranexamic acid — all proven to reduce inflammation and support barrier repair",
      "Ceramide-forward moisturizer with a balanced ratio of ceramides, fatty acids, and cholesterol — this lipid trio directly replenishes the barrier's structural components",
      "Avoid all retinoids, acids, and high-potency actives until the barrier is fully stable; introduce them only at the lowest available concentration with a buffer moisturizer underneath",
    ],
    keyIngredients: [
      { name: "Centella Asiatica (Cica)", benefit: "One of the most comprehensively studied calming botanical ingredients — reduces neurogenic inflammation, accelerates wound healing, and supports ceramide production in the barrier" },
      { name: "Panthenol (Provitamin B5)", benefit: "Converts to pantothenic acid in the skin, where it deeply hydrates, calms irritation, and accelerates the natural barrier repair process" },
      { name: "Allantoin", benefit: "Keratolytic and skin-conditioning agent that soothes sensitized skin, reduces itching, and supports the formation of new healthy skin cells" },
      { name: "Madecassoside", benefit: "Purified active component of centella with potent anti-inflammatory action — reduces redness and calms reactivity at very low concentrations" },
      { name: "Beta-Glucan", benefit: "Polysaccharide derived from oats that activates skin's natural barrier repair, provides deep hydration, and has clinically demonstrated calming effects" },
      { name: "Ceramides (1, 3, 6-II)", benefit: "The structural lipids of the skin barrier — topical application directly replenishes what is deficient in sensitive, compromised skin" },
      { name: "Colloidal Oatmeal", benefit: "FDA-recognized skin protectant with clinically proven ability to soothe, reduce itching, and form a protective film over inflamed skin" },
    ],
    avoidIngredients: [
      { name: "Synthetic Fragrance", benefit: "The single most common cause of contact dermatitis in skincare — responsible for far more reactions than any other ingredient category, including both 'perfume' and individual fragrance components" },
      { name: "Denatured Alcohol (Alcohol Denat.)", benefit: "A harsh solvent that disrupts the lipid barrier, kills beneficial skin microbiome bacteria, and triggers immediate and lasting irritation in sensitive skin" },
      { name: "Essential Oils", benefit: "Despite their natural origin, many essential oils — lavender, peppermint, citrus, eucalyptus — are potent sensitizers and allergens with well-documented skin reactivity data" },
      { name: "Preservatives (MI, Formaldehyde Releasers)", benefit: "Methylisothiazolinone and formaldehyde-releasing preservatives are among the most common causes of preservative-contact allergy, particularly in leave-on products" },
      { name: "Physical Exfoliants / Scrubs", benefit: "Microabrasions from physical scrubs compromise an already fragile barrier — sensitive skin requires only the gentlest chemical exfoliants at low concentrations, and only when fully stable" },
    ],
    lifestyleTips: [
      "Patch test every new product for at least 48 hours on the inner arm before applying to the face — one reaction can set your barrier recovery back by weeks",
      "Use fragrance-free laundry detergent and fabric softener — pillowcases and towels are daily skin-contact surfaces and are a frequently overlooked sensitizing vector",
      "Prioritize active stress management — cortisol is a measurable, direct trigger for barrier permeability and skin inflammation; even basic mindfulness practices show skin improvement in clinical studies",
      "Wear broad-spectrum SPF daily, including cloudy days — UV exposure is one of the most consistent and cumulative sensitizing factors across all sensitive skin presentations",
      "Keep a simple skin diary noting products, foods, weather, stress levels, and sleep quality alongside skin reactions — patterns that point to your personal triggers typically emerge within 2–3 weeks",
      "Simplify your routine to the fewest products possible when experiencing a flare — cleanse, moisturize, protect; add back one product at a time only after the skin has fully calmed",
      "Choose makeup with minimal ingredient lists; mineral-based makeup with zinc oxide provides cosmetic coverage while also functioning as sun protection",
    ],
  },

  combination: {
    title: "Combination Skin",
    tagline: "Two zones, one face — targeted zone-specific care is your greatest advantage.",
    overview: [
      "Combination skin is the most common skin type globally, and paradoxically one of the most mismanaged — because it fundamentally resists the one-product-for-everything approach that drives most skincare marketing. The defining characteristic is a pronounced difference between facial zones: the T-zone (forehead, nose, chin) tends to be oily with enlarged pores and a shine that returns within hours of cleansing, while the U-zone (cheeks, temples, jawline) ranges from normal to dry and can feel tight or show flaking.",
      "This bimodal distribution is anatomical in origin. The T-zone contains a significantly higher density of sebaceous glands per square centimeter than the cheeks and peripheral face — this isn't something that changes with products or routine. The practical challenge is that a moisturizer rich enough for dry cheeks will over-hydrate the T-zone, and a clay-heavy treatment appropriate for the nose will strip and irritate the cheeks if applied carelessly across the entire face.",
      "Combination skin also fluctuates meaningfully with the seasons and climate. In summer and humid conditions, the T-zone becomes oilier while the cheeks may stay balanced. In winter and dry conditions, the cheeks can become significantly drier while the T-zone may still produce oil. Understanding this seasonal rhythm — and adapting your routine accordingly rather than fighting against it — is the key strategic shift that makes combination skin genuinely manageable.",
    ],
    characteristics: [
      "Persistent shine concentrated in the T-zone (forehead, nose, chin), typically reappearing within 2–3 hours of morning cleansing",
      "Visibly enlarged pores around the nose and inner cheeks where sebaceous gland density is highest",
      "Dry or normal-feeling cheeks that may feel tight after washing and show flaking in dry or cold conditions",
      "Breakouts confined almost exclusively to the T-zone — cheeks rarely experience acne unless the wrong products are used",
      "Uneven skin texture across the face — smooth in some areas, congested in others",
      "Seasonal behavioral shift: oilier overall in summer and humid weather, drier in winter and low-humidity environments",
      "Products optimized for one zone often create problems in the other — moisturizers rich enough for cheeks clog the T-zone; oil-control products used everywhere leave cheeks dry",
    ],
    causes: [
      "Anatomical sebaceous gland distribution: the T-zone has a denser concentration of oil-producing glands by genetic design — this is not caused by products or lifestyle",
      "Genetic inheritance: combination skin pattern is strongly inherited, following family lines in sebaceous gland density and distribution",
      "Hormonal fluctuations: estrogen, progesterone, and androgen ratios affect different facial zones differently — the T-zone is more androgen-sensitive than the cheeks",
      "Routine mismatches: applying one-size-fits-all products across the face disrupts the natural balance — using only oil-control products dries out the cheeks; using rich creams everywhere clogs T-zone pores",
      "Diet and lifestyle: spicy foods, alcohol, and cortisol from stress can amplify T-zone oiliness specifically, while not affecting the cheek zone to the same degree",
      "Seasonal and environmental shifts: high humidity increases T-zone output; cold and dry environments dehydrate the cheeks while the T-zone continues its baseline oil production",
    ],
    morningRoutine: [
      "Gentle gel or mild foam cleanser — balanced enough to clear T-zone overnight sebum without stripping the cheeks' more fragile barrier",
      "Balancing toner with niacinamide (5%) or green tea — apply across the entire face; niacinamide is zone-agnostic and helps regulate both oiliness and barrier function",
      "Hydrating serum with hyaluronic acid — apply across the full face; lightweight hydration benefits both the cheeks (moisture) and T-zone (prevents compensatory sebum overproduction)",
      "Zone-differentiated moisturizing: a lightweight gel moisturizer all over, with an optional richer cream applied only to the cheeks if they feel dry",
      "SPF 30+ in a gel or fluid formula — heavy cream sunscreens may be appropriate for the cheeks but will feel suffocating on the T-zone; a fluid formula works across both",
    ],
    eveningRoutine: [
      "Oil or balm cleanser to first dissolve sunscreen and makeup effectively — the oil base is particularly good at clearing T-zone congestion",
      "Gentle cream or gel cleanser for the second cleanse — adjust pressure: firmer across the T-zone, lighter on the cheeks",
      "Niacinamide or centella asiatica serum applied across the full face — both ingredients address oiliness and barrier health simultaneously, making them ideal for combination skin",
      "T-zone targeted treatment 2–3 nights per week: BHA (salicylic acid) serum or gel applied only to the nose, forehead, and chin to address pore congestion",
      "Gel moisturizer over the full face; supplement with a richer cream or 2–3 drops of facial oil applied only to the cheeks if they need extra nourishment",
      "Weekly exfoliation strategy: AHA on the cheeks for smoothness and tone; BHA on the T-zone for pore clarity — treat each zone for what it actually needs",
    ],
    keyIngredients: [
      { name: "Niacinamide", benefit: "The ideal combination skin ingredient — regulates sebum in the oily T-zone, strengthens the barrier in drier cheeks, and minimizes pores across both zones" },
      { name: "Hyaluronic Acid", benefit: "Lightweight humectant that hydrates without clogging; provides moisture to the cheeks without over-hydrating the T-zone" },
      { name: "Salicylic Acid (BHA)", benefit: "Oil-soluble acid that penetrates T-zone pores and clears sebum congestion — use as a targeted spot treatment on the T-zone only, not across the full face" },
      { name: "Ceramides", benefit: "Replenish the barrier in the drier cheek zone without contributing to T-zone congestion when used in balanced moisturizer formulas" },
      { name: "Green Tea Extract (EGCG)", benefit: "Antioxidant with mild sebum-regulating and anti-inflammatory properties; gentle enough to use across both zones of combination skin" },
      { name: "Azelaic Acid", benefit: "Gentle multi-tasker that addresses both oiliness and uneven tone across the full face — well-tolerated by combination and sensitive-combination skin types" },
      { name: "Centella Asiatica", benefit: "Calming and barrier-repairing botanical that addresses any inflammation in the T-zone while supporting barrier integrity in the drier cheek zone" },
    ],
    avoidIngredients: [
      { name: "Heavy Occlusive Creams (applied all over)", benefit: "Rich creams designed for dry skin block sebum pathways in the T-zone when applied across the full face — reserve them exclusively for the cheeks and outer jawline" },
      { name: "Oil-Control Products Used Everywhere", benefit: "Using clay masks or strong BHA treatments across the entire face consistently strips and dries out the cheeks, disrupting their already more fragile barrier" },
      { name: "Alcohol-Heavy Toners", benefit: "May temporarily reduce T-zone shine but damage the cheeks' barrier simultaneously — a net negative for combination skin treated as a single skin type" },
      { name: "Physical Scrubs Across the Full Face", benefit: "The friction that may beneficially exfoliate the T-zone is too aggressive for the thinner-barrier cheek zone — use only the T-zone if used at all" },
    ],
    lifestyleTips: [
      "Think and apply in zones — you don't need to apply every product uniformly across your face; adjusting amount and product by zone is the key combination skin strategy",
      "A kaolin or bentonite clay mask applied once or twice a week to the T-zone only (leave cheeks bare) is one of the highest-impact interventions for managing the oily zone",
      "Blotting papers for T-zone touch-ups are preferable to powder for combination skin — they absorb oil without adding product weight that can eventually migrate and clog pores",
      "In summer, transition to lighter products across the entire face; in winter, maintain your standard routine but add a richer cream for the cheeks specifically in the evening",
      "Keep touching the T-zone to a minimum throughout the day — it has the most active sebaceous glands and the highest bacterial colonization; touching transfers more oil and bacteria to an already vulnerable zone",
      "Stress management disproportionately benefits the T-zone in combination skin — cortisol selectively amplifies sebaceous gland activity in androgen-sensitive zones",
      "If you can afford two cleansers, use a gel formula focused on the T-zone and a cream cleanser for the cheeks — even alternating based on how each zone feels on a given day makes a meaningful difference",
    ],
  },
}

// Score-based modifiers — these are added on top of the base skin type description
// Score directions: redness/trouble = higher is worse; moisture/brightness/tone = higher is better
export function getScoreModifiers(scores: {
  redness: { score: number }
  trouble: { score: number }
  moisture: { score: number }
  brightness: { score: number }
  tone: { score: number }
}): ScoreModifier[] {
  const modifiers: ScoreModifier[] = []

  if (scores.moisture.score < 35) {
    modifiers.push({
      id: "critical_dryness",
      color: "#93C5FD",
      title: "Critical Moisture Deficit",
      body: "Your moisture levels are significantly below baseline, indicating a severely impaired moisture barrier. At this level, the skin is losing water faster than it can retain it — a condition called high transepidermal water loss (TEWL). This is not just a comfort issue; compromised moisture at this degree accelerates collagen degradation, increases UV sensitivity, and makes the skin vulnerable to infections and inflammatory conditions.",
      tips: [
        "Apply a hydrating serum immediately after cleansing while skin is still damp, within 30 seconds — the moisture window is critical at this level",
        "Use a ceramide-rich occlusive moisturizer morning and evening — skip no application",
        "Consider a hydrating sleeping mask as the final step every night until moisture levels improve",
        "Temporarily avoid all active ingredients (retinoids, exfoliating acids) — the barrier cannot handle them at this hydration level",
        "Add a humidifier to your sleep environment as an urgent measure",
      ],
    })
  }

  if (scores.redness.score > 65) {
    modifiers.push({
      id: "active_redness",
      color: "#FCA5A5",
      title: "Active Inflammation & Redness",
      body: "Your skin is currently showing significant inflammatory activity. Redness at this level indicates that the capillaries near the skin surface are dilated and the underlying tissue is in an active inflammatory state — not just surface-level flushing. Prolonged vascular inflammation of this degree, if not addressed, can lead to permanently visible capillaries (telangiectasia) and progressive sensitization where more and more things trigger the response.",
      tips: [
        "Avoid all heat exposure — hot water, steam rooms, hot beverages, and spicy foods all dilate surface capillaries and worsen redness",
        "Apply only calming, fragrance-free products; any ingredient causing the slightest stinging sensation should be immediately removed from your routine",
        "Centella asiatica or madecassoside-based products applied as a treatment step can visibly reduce inflammation within 2–4 weeks of consistent use",
        "Mineral (zinc oxide) sunscreen is non-negotiable — UV exposure is the most consistent amplifier of vascular inflammation",
        "If redness persists or is accompanied by visible broken capillaries, consult a dermatologist to rule out rosacea, which requires specific prescription management",
      ],
    })
  }

  if (scores.trouble.score > 65) {
    modifiers.push({
      id: "active_breakouts",
      color: "#F9A8C9",
      title: "Active Breakout Concern",
      body: "Your skin is showing a significant level of acne-related activity. Active breakouts indicate an interplay of excess sebum, dead skin cell accumulation, and Cutibacterium acnes (acne bacteria) colonization in the pores. At elevated trouble scores, the inflammatory response extends beyond individual blemishes — the entire affected area is in a pro-inflammatory state that can spread if not actively managed, and each untreated inflammatory lesion carries a real risk of post-inflammatory hyperpigmentation (PIH) even in lighter skin tones.",
      tips: [
        "Do not pick, pop, or squeeze — mechanical manipulation introduces new bacteria, deepens the lesion, and is the primary cause of acne scarring and PIH",
        "Introduce salicylic acid (BHA) as a daily or every-other-day leave-on treatment — it's the most effective non-prescription ingredient for clearing active and forming breakouts",
        "Niacinamide applied twice daily reduces sebum production and has mild anti-inflammatory effects that visibly reduce active lesion count over 4–8 weeks",
        "Change your pillowcase every 2–3 days without exception — fabric harbors the exact bacteria driving your current breakouts",
        "If you have cystic or nodular acne, seek dermatological evaluation — prescription retinoids or antibiotics may be necessary to prevent permanent scarring",
      ],
    })
  }

  if (scores.brightness.score < 40) {
    modifiers.push({
      id: "dullness",
      color: "#FCD34D",
      title: "Significant Brightness Deficit",
      body: "Your skin's brightness reading is below the threshold where natural cell turnover adequately clears accumulated dead skin cells. The dullness you're experiencing is largely a physical phenomenon: an excess layer of non-reflecting corneocytes (dead cells) on the surface is diffusing rather than reflecting light, creating a flat, grayish appearance. Underneath this layer, newer and more radiant skin cells are waiting — they just need to be uncovered. Contributing factors often include sun damage, impaired circulation, poor sleep, and accumulated oxidative stress.",
      tips: [
        "Introduce a low-concentration AHA (glycolic acid 5–8% or lactic acid 5–10%) two to three times per week in the evening — this directly accelerates the shedding of the dull outer cell layer",
        "Vitamin C serum (L-ascorbic acid or more stable derivatives like ascorbyl glucoside) applied every morning neutralizes the free radicals that progressively dull skin over time",
        "Gentle enzyme-based exfoliation (papain, bromelain) 1–2× weekly is an additional option, particularly for sensitive skin that cannot tolerate acids",
        "Increase sleep quality — skin cell regeneration peaks between 11pm and 2am; consistent sleep deprivation measurably impairs the renewal process",
        "Gua sha or facial massage tools applied with a light oil improve microcirculation, which directly supports the 'lit-from-within' brightness that no topical product alone can fully replicate",
      ],
    })
  }

  if (scores.tone.score < 40) {
    modifiers.push({
      id: "uneven_tone",
      color: "#C4B5FD",
      title: "Uneven Skin Tone",
      body: "Your tone analysis shows significant unevenness, likely a combination of active melanin irregularities (hyperpigmentation, dark spots) and vascular inconsistency (redness patterns, post-inflammatory marks). Uneven tone at this level typically reflects accumulated history — post-acne marks, sun damage spots, and hormonally influenced melasma patches. The melanin-related component responds to brightening actives, while the vascular component requires anti-inflammatory and capillary-strengthening approaches.",
      tips: [
        "Tranexamic acid (2–5%) is currently the most evidence-backed brightening ingredient for all skin tones — it inhibits melanin transfer without the irritation risk of older brightening ingredients",
        "Niacinamide at 5–10% concentration inhibits the transfer of melanin to skin cells (melanosome transfer), visibly reducing existing dark spots over 8–12 weeks",
        "Daily SPF is not optional when targeting uneven tone — UV exposure directly re-stimulates melanocytes and undoes months of brightening progress in days",
        "Azelaic acid (10%) addresses both the melanin component and any inflammatory redness contributing to tone unevenness — it's safe for pregnancy and suitable for sensitive skin",
        "Consider retinol (0.025–0.1%) in your evening routine once the barrier is stable — it accelerates cell turnover, bringing newer, more evenly pigmented cells to the surface faster",
      ],
    })
  }

  return modifiers
}
