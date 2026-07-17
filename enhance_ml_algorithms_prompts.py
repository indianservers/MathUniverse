from pathlib import Path

BASE = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts\Ml Algorithms")

VARIANTS = [
    (
        "01_01_Concept_Map.txt",
        "Concept Map and Intuition",
        "Beginner to intermediate",
        "Build intuition with the task, input-output mapping, core model idea, assumptions and failure modes.",
    ),
    (
        "02_02_Training_Workflow.txt",
        "Training Workflow and Evaluation",
        "Intermediate to advanced",
        "Show preprocessing, training loop, objective function, validation, metrics, tuning and error analysis.",
    ),
    (
        "03_03_Advanced_Math_and_Architecture.txt",
        "Advanced Math, Architecture and Research View",
        "Advanced undergraduate to postgraduate",
        "Connect the algorithm to formal math, architecture design, optimization, complexity and modern applications.",
    ),
]

FORMULA_BLOCKS = {
    "01_Linear_Regression": [
        "y = beta_0 + beta_1 x_1 + ... + beta_p x_p + epsilon",
        "Vector form: y_hat = X beta",
        "Least squares loss: L(beta) = ||y - X beta||_2^2",
        "Normal equation: beta_hat = (X^T X)^(-1) X^T y, when X^T X is invertible",
        "Metrics: MSE, RMSE, MAE, R^2",
    ],
    "02_Logistic_Regression": [
        "Sigmoid: sigma(z) = 1 / (1 + exp(-z))",
        "Logit: log(p / (1 - p)) = w^T x + b",
        "Binary cross-entropy: L = -[y log(p) + (1-y) log(1-p)]",
        "Decision rule: predict 1 if p >= threshold",
        "Metrics: confusion matrix, precision, recall, F1, ROC-AUC, PR-AUC",
    ],
    "03_K_Nearest_Neighbors": [
        "Euclidean distance: d(x, z) = sqrt(sum_j (x_j - z_j)^2)",
        "Manhattan distance: d(x, z) = sum_j |x_j - z_j|",
        "Classification: y_hat = majority vote among k nearest neighbours",
        "Regression: y_hat = mean of k nearest target values",
        "Show effect of k, feature scaling and distance metric choice",
    ],
    "04_Naive_Bayes": [
        "Bayes theorem: P(y|x) = P(x|y) P(y) / P(x)",
        "Naive assumption: P(x_1,...,x_d|y) = product_j P(x_j|y)",
        "Classifier: y_hat = argmax_y P(y) product_j P(x_j|y)",
        "Use log probabilities to avoid underflow",
        "Include Laplace smoothing for categorical/text features",
    ],
    "05_Decision_Trees": [
        "Entropy: H(S) = -sum_c p_c log2(p_c)",
        "Information gain: IG = H(parent) - sum_k (n_k/n) H(child_k)",
        "Gini impurity: G = 1 - sum_c p_c^2",
        "Regression split criterion: minimize sum of squared errors",
        "Show max depth, min samples leaf, pruning and overfitting risk",
    ],
    "06_Random_Forests": [
        "Bootstrap sample each tree from training data",
        "At each split, consider random subset of features",
        "Classification: y_hat = majority vote across trees",
        "Regression: y_hat = average prediction across trees",
        "Show out-of-bag error and feature importance with caveats",
    ],
    "07_Gradient_Boosting_XGBoost_LightGBM": [
        "Additive model: F_m(x) = F_(m-1)(x) + eta h_m(x)",
        "Each new tree fits negative gradient or residual of loss",
        "Regularized objective: loss + tree complexity penalty",
        "Learning rate eta, max depth, subsampling and early stopping must be visible",
        "Show residual correction sequence and validation loss curve",
    ],
    "08_Support_Vector_Machines": [
        "Hard margin objective: minimize 1/2 ||w||^2 subject to y_i(w^T x_i + b) >= 1",
        "Soft margin adds slack variables and C penalty",
        "Kernel decision: f(x) = sum_i alpha_i y_i K(x_i, x) + b",
        "Margin width proportional to 2 / ||w||",
        "Show support vectors exactly on or inside margin",
    ],
    "09_K_Means_Clustering": [
        "Objective: minimize sum_i ||x_i - mu_{c_i}||^2",
        "Assignment step: c_i = argmin_k ||x_i - mu_k||^2",
        "Update step: mu_k = mean of points assigned to cluster k",
        "Show inertia and elbow method",
        "Warn that k-means prefers roughly spherical clusters",
    ],
    "10_Hierarchical_Clustering": [
        "Start with each point as its own cluster",
        "Merge closest clusters by linkage rule",
        "Linkage options: single, complete, average, Ward",
        "Show dendrogram height as merge distance",
        "Cluster count chosen by cutting dendrogram at height threshold",
    ],
    "11_DBSCAN": [
        "Parameters: epsilon radius eps and minPts",
        "Core point: at least minPts neighbours within eps",
        "Border point: reachable from core point but not core",
        "Noise point: not density reachable",
        "Show arbitrary cluster shapes and varying-density limitation",
    ],
    "12_Principal_Component_Analysis": [
        "Center data: X_c = X - mean(X)",
        "Covariance: Sigma = (1/(n-1)) X_c^T X_c",
        "Eigenproblem: Sigma v = lambda v",
        "Projection: Z = X_c W_k",
        "Explained variance ratio: lambda_i / sum_j lambda_j",
    ],
    "13_Gaussian_Mixture_Models_EM": [
        "Mixture density: p(x) = sum_k pi_k N(x | mu_k, Sigma_k)",
        "E-step: compute responsibilities gamma_ik",
        "M-step: update pi_k, mu_k and Sigma_k",
        "Log-likelihood should increase or stay flat each EM iteration",
        "Show soft cluster membership rather than hard labels only",
    ],
    "14_Neural_Networks_Basics": [
        "Layer equation: a_l = phi(W_l a_(l-1) + b_l)",
        "Common activations: ReLU(z)=max(0,z), sigmoid, tanh, softmax",
        "Loss examples: MSE for regression, cross-entropy for classification",
        "Show forward pass, loss, backward pass and parameter update",
        "Include train/validation/test separation",
    ],
    "15_Backpropagation_and_Gradient_Descent": [
        "Gradient descent: theta <- theta - alpha grad_theta L(theta)",
        "Chain rule: dL/dx = dL/dy * dy/dx",
        "Show computation graph with local gradients",
        "Learning-rate comparison: too small, stable, too large",
        "Include vanishing/exploding gradients and gradient clipping panel",
    ],
    "16_Convolutional_Neural_Networks": [
        "Convolution feature map: y[i,j,k] = sum_{u,v,c} W[u,v,c,k] x[i+u,j+v,c] + b_k",
        "Show kernel size, stride, padding and channels",
        "Output size formula for convolution/pooling must be labelled",
        "Include receptive field growth across layers",
        "Avoid showing CNN as fully connected spaghetti",
    ],
    "17_Recurrent_Neural_Networks_LSTM_GRU": [
        "Basic RNN: h_t = phi(W_x x_t + W_h h_(t-1) + b)",
        "LSTM gates: input, forget, output and candidate cell state",
        "GRU gates: reset and update",
        "Show unrolled time steps and shared weights",
        "Include vanishing gradient and long-range dependency panel",
    ],
    "18_Transformers_and_Attention": [
        "Scaled dot-product attention: Attention(Q,K,V)=softmax(QK^T/sqrt(d_k))V",
        "Q = X W_Q, K = X W_K, V = X W_V",
        "Multi-head attention = concat(head_1,...,head_h) W_O",
        "Include positional encoding or position embeddings",
        "Show residual connections, layer norm and feed-forward block",
    ],
    "19_Large_Language_Models": [
        "Tokenization -> embeddings -> transformer blocks -> logits -> softmax probabilities",
        "Training objective: maximize sum_t log P(x_t | x_<t), or minimize next-token cross-entropy",
        "Show context window, attention mask and autoregressive generation",
        "Distinguish pretraining, supervised fine-tuning, RLHF/RLAIF and inference",
        "Include hallucination, bias, latency and evaluation caveats",
    ],
    "20_Autoencoders_and_Representation_Learning": [
        "Encoder: z = f_theta(x)",
        "Decoder: x_hat = g_phi(z)",
        "Reconstruction loss: L = ||x - x_hat||^2 or BCE",
        "Show bottleneck, latent space and reconstruction comparison",
        "Applications: denoising, anomaly detection, compression, representation learning",
    ],
    "21_Variational_Autoencoders": [
        "Encoder outputs q_phi(z|x) with mu and sigma",
        "Reparameterization: z = mu + sigma * epsilon, epsilon ~ N(0,I)",
        "ELBO: E_q[log p_theta(x|z)] - KL(q_phi(z|x) || p(z))",
        "Show reconstruction loss plus KL regularization",
        "Latent space should be continuous and sampleable",
    ],
    "22_Generative_Adversarial_Networks": [
        "Generator: x_fake = G(z)",
        "Discriminator: D(x) estimates real/fake probability",
        "Minimax objective: min_G max_D E[log D(x)] + E[log(1 - D(G(z)))]",
        "Show alternating updates for D and G",
        "Include mode collapse, instability and evaluation caveats",
    ],
    "23_Diffusion_Models": [
        "Forward process: q(x_t|x_(t-1)) adds Gaussian noise",
        "Training often predicts noise epsilon_theta(x_t,t)",
        "Reverse process denoises from x_T to x_0 over timesteps",
        "Show U-Net/denoiser, timestep embedding and sampling schedule",
        "Do not show one-step magic generation unless labelled simplified",
    ],
    "24_Reinforcement_Learning_Basics": [
        "MDP tuple: (S, A, P, R, gamma)",
        "Return: G_t = sum_{k=0}^infty gamma^k R_(t+k+1)",
        "Policy: pi(a|s)",
        "Value: V^pi(s) = E_pi[G_t | S_t=s]",
        "Show agent-environment loop and exploration/exploitation",
    ],
    "25_Q_Learning_and_Deep_Q_Networks": [
        "Q-learning update: Q(s,a) <- Q(s,a) + alpha [r + gamma max_a' Q(s',a') - Q(s,a)]",
        "DQN loss: (r + gamma max_a' Q_target(s',a') - Q(s,a))^2",
        "Show replay buffer, target network and epsilon-greedy exploration",
        "Mark terminal states correctly",
        "Include overestimation and stability caveats",
    ],
    "26_Policy_Gradient_and_Actor_Critic": [
        "Objective: J(theta)=E_pi_theta[return]",
        "Policy gradient: grad J = E[grad log pi_theta(a|s) * advantage]",
        "Advantage: A(s,a)=Q(s,a)-V(s)",
        "Actor updates policy; critic estimates value",
        "Show variance reduction and entropy regularization panel",
    ],
    "27_Model_Evaluation_and_Metrics": [
        "Accuracy = (TP + TN) / (TP + TN + FP + FN)",
        "Precision = TP / (TP + FP)",
        "Recall = TP / (TP + FN)",
        "F1 = 2 * precision * recall / (precision + recall)",
        "Regression metrics: MAE, MSE, RMSE, R^2; include calibration and leakage warnings",
    ],
    "28_Overfitting_Regularization_and_Generalization": [
        "Generalization gap = validation error - training error",
        "L2 penalty: lambda ||w||_2^2",
        "L1 penalty: lambda ||w||_1",
        "Dropout: randomly mask activations during training",
        "Show bias-variance tradeoff and early stopping curve",
    ],
    "29_Feature_Engineering_and_Preprocessing": [
        "Standardization: z = (x - mean) / std",
        "Min-max scaling: x' = (x - min) / (max - min)",
        "One-hot encoding for categorical features",
        "Train preprocessing only on training data, then apply to validation/test",
        "Include leakage, missing values, outliers and feature-selection caveats",
    ],
    "30_MLOps_Model_Deployment_and_Monitoring": [
        "Pipeline: data -> validation -> training -> registry -> deployment -> monitoring -> retraining",
        "Track model version, data version, metrics and lineage",
        "Monitor data drift, concept drift, latency, cost and error rates",
        "Show canary/shadow/A-B deployment options",
        "Include rollback and human review checkpoints",
    ],
}

GLOBAL_ENHANCEMENT = """# FORMULA, ARCHITECTURE AND VISUAL ASSET CHECKLIST
* Include the exact formula block for this algorithm in large typeset text, not as tiny decoration.
* Show variable definitions directly beside the formula: x, y, theta, w, b, X, loss, gradient, probability, hidden state, token or tensor shape as relevant.
* Include a toy numerical or visual example that matches the formula.
* Include at least one evaluation visual: confusion matrix, residual plot, ROC/PR curve, loss curve, calibration plot, cluster-quality plot, reward curve, reconstruction error or monitoring dashboard as relevant.
* Include at least one failure-mode visual: overfitting, data leakage, class imbalance, outliers, drift, mode collapse, hallucination, instability, bias or poor calibration as relevant.
* Do not use generic AI imagery as the main visual; prefer algorithm-specific assets and real diagrams.
"""

QUALITY_APPEND = """# PREMIER IMAGE ASSET DIRECTION
Use a premium technical-poster look: precise grids, clean model blocks, readable tensor/matrix shapes, high-contrast legends, real data-style plots, consistent colour coding and sharp vector equations. The output should look like a polished university AI lab wall chart, not a generic AI marketing graphic.
"""

NEW_TOPICS = [
    ("31_Ridge_Lasso_and_Elastic_Net", "RIDGE, LASSO AND ELASTIC NET REGRESSION", "regularized linear models, coefficient shrinkage, sparsity, multicollinearity and model selection", "coefficient paths, L1 diamond, L2 circle, elastic-net penalty blend, validation curve, sparse feature panel", [
        "Ridge objective: ||y - Xw||_2^2 + lambda ||w||_2^2",
        "Lasso objective: ||y - Xw||_2^2 + lambda ||w||_1",
        "Elastic Net: loss + lambda1 ||w||_1 + lambda2 ||w||_2^2",
        "Show coefficient shrinkage, feature selection and cross-validation for lambda",
    ]),
    ("32_Bayesian_Linear_Regression", "BAYESIAN LINEAR REGRESSION", "priors, likelihood, posterior distributions, uncertainty intervals and predictive distributions", "prior distribution, likelihood curve, posterior distribution, regression line uncertainty band, predictive interval", [
        "Bayes: p(w|D) proportional to p(D|w) p(w)",
        "Likelihood: y|X,w ~ N(Xw, sigma^2 I)",
        "Posterior over weights instead of single point estimate",
        "Show credible intervals and predictive uncertainty distinctly",
    ]),
    ("33_Gaussian_Processes", "GAUSSIAN PROCESSES", "nonparametric regression, kernels, covariance functions, posterior functions and uncertainty", "sample functions from prior, kernel matrix heatmap, observed points, posterior mean, uncertainty band", [
        "Prior: f(x) ~ GP(m(x), k(x,x'))",
        "Kernel examples: RBF, Matern, periodic",
        "Posterior mean and covariance after observing data",
        "Show uncertainty shrinking near observations",
    ]),
    ("34_Time_Series_Forecasting", "TIME SERIES FORECASTING", "trend, seasonality, autocorrelation, ARIMA, exponential smoothing, validation and forecast intervals", "time series plot, trend-seasonality decomposition, autocorrelation plot, rolling forecast split, prediction interval", [
        "AR model: y_t = c + sum_i phi_i y_(t-i) + epsilon_t",
        "MA model: y_t = mu + epsilon_t + sum_i theta_i epsilon_(t-i)",
        "ARIMA includes differencing order d",
        "Show walk-forward validation and forecast intervals",
    ]),
    ("35_Hidden_Markov_Models", "HIDDEN MARKOV MODELS", "hidden states, observations, transition probabilities, emission probabilities, Viterbi decoding and sequence modelling", "hidden state chain, observation sequence, transition matrix, emission matrix, Viterbi trellis", [
        "State transition: P(z_t | z_(t-1))",
        "Emission: P(x_t | z_t)",
        "Joint: P(z_1:T, x_1:T) = P(z_1) product_t P(x_t|z_t) P(z_t|z_(t-1))",
        "Show forward algorithm and Viterbi path concept",
    ]),
    ("36_Recommender_Systems", "RECOMMENDER SYSTEMS", "collaborative filtering, content-based filtering, matrix factorization, embeddings and ranking metrics", "user-item matrix, sparse ratings, latent factors, recommendation ranking, precision@k panel", [
        "Matrix factorization: R_hat = U V^T",
        "Objective: minimize observed rating error plus regularization",
        "Ranking metrics: precision@k, recall@k, NDCG",
        "Show cold-start and popularity-bias caveats",
    ]),
    ("37_Association_Rule_Mining_Apriori", "ASSOCIATION RULE MINING AND APRIORI", "market baskets, support, confidence, lift, frequent itemsets and rule discovery", "transaction table, itemset lattice, support-confidence chart, rule arrows, lift comparison", [
        "Support(A) = count(A) / N",
        "Confidence(A -> B) = support(A union B) / support(A)",
        "Lift(A -> B) = confidence(A -> B) / support(B)",
        "Show Apriori principle: all subsets of frequent itemset must be frequent",
    ]),
    ("38_Anomaly_Detection", "ANOMALY DETECTION", "outliers, novelty detection, isolation forest, one-class SVM, reconstruction error and monitoring", "normal data cloud, anomaly points, isolation tree cuts, one-class boundary, reconstruction error threshold", [
        "Anomaly score must be defined by model type",
        "Isolation forest isolates anomalies with shorter path lengths",
        "One-class SVM learns boundary around normal data",
        "Autoencoder anomaly score often uses reconstruction error",
    ]),
    ("39_Semi_Supervised_Learning", "SEMI-SUPERVISED LEARNING", "few labels, many unlabeled examples, pseudo-labeling, consistency regularization and label propagation", "small labelled dataset, large unlabelled cloud, pseudo-label arrows, graph label propagation, confidence threshold", [
        "Pseudo-label: y_hat = model prediction used as temporary label",
        "Consistency loss: predictions should remain stable under augmentation",
        "Graph label propagation spreads labels through similarity graph",
        "Show confirmation-bias risk from wrong pseudo-labels",
    ]),
    ("40_Transfer_Learning_and_Fine_Tuning", "TRANSFER LEARNING AND FINE-TUNING", "pretrained models, frozen layers, feature extraction, fine-tuning, domain adaptation and catastrophic forgetting", "pretrained backbone, frozen layers, new task head, fine-tuning arrows, source-target domain shift panel", [
        "Feature extraction: freeze backbone, train new head",
        "Fine-tuning: update some or all pretrained weights",
        "Learning rates often differ for backbone and head",
        "Show source domain, target domain and negative transfer risk",
    ]),
    ("41_Self_Supervised_and_Contrastive_Learning", "SELF-SUPERVISED AND CONTRASTIVE LEARNING", "pretext tasks, positive pairs, negative pairs, embeddings, contrastive loss and representation learning", "two augmented views, encoder towers, embedding space, positive/negative pairs, similarity matrix", [
        "InfoNCE-style loss contrasts positive pair against negatives",
        "Similarity often cosine similarity or dot product",
        "Show augmentations and embedding clustering",
        "Avoid implying labels are never useful",
    ]),
    ("42_Graph_Neural_Networks", "GRAPH NEURAL NETWORKS", "nodes, edges, message passing, graph convolution, node classification, link prediction and graph embeddings", "graph with node features, message arrows, aggregation function, updated node embeddings, graph-level readout", [
        "Message passing: h_v^(k) = UPDATE(h_v^(k-1), AGG({h_u^(k-1): u in N(v)}))",
        "Show adjacency matrix and node feature matrix",
        "Tasks: node classification, graph classification, link prediction",
        "Include oversmoothing and scalability caveats",
    ]),
    ("43_Causal_Inference", "CAUSAL INFERENCE", "causal graphs, confounding, interventions, potential outcomes, A/B tests and do-calculus intuition", "DAG with treatment/outcome/confounder, backdoor path, randomized experiment, counterfactual outcomes table", [
        "Potential outcomes: treatment effect = Y(1) - Y(0)",
        "ATE = E[Y(1) - Y(0)]",
        "Intervention notation: P(Y | do(X=x))",
        "Show correlation versus causation and confounding adjustment",
    ]),
    ("44_Hyperparameter_Optimization", "HYPERPARAMETER OPTIMIZATION", "grid search, random search, Bayesian optimization, validation curves, search spaces and resource-aware tuning", "hyperparameter search grid, random samples, Bayesian surrogate model, acquisition function, validation score surface", [
        "Hyperparameters are set before training, not learned by gradient in ordinary training",
        "Grid search, random search and Bayesian optimization comparison",
        "Use validation set or cross-validation, not test set",
        "Show over-tuning risk and compute budget",
    ]),
    ("45_Explainable_AI_SHAP_LIME", "EXPLAINABLE AI: SHAP AND LIME", "feature attribution, local explanations, global importance, Shapley values, surrogate models and explanation limits", "prediction explanation waterfall, feature attribution bars, local surrogate boundary, global importance plot", [
        "SHAP is based on Shapley value attribution",
        "LIME fits local surrogate model around one prediction",
        "Explanations are not proof of causality",
        "Show local vs global explanation distinction",
    ]),
    ("46_Fairness_Bias_and_Responsible_AI", "FAIRNESS, BIAS AND RESPONSIBLE AI", "dataset bias, group fairness, individual fairness, disparate impact, audits, transparency and governance", "dataset composition chart, fairness metric dashboard, subgroup performance table, model card, audit workflow", [
        "Compare metrics across groups: error rates, TPR, FPR, calibration",
        "Fairness criteria can conflict",
        "Bias can enter data, labels, features, objectives and deployment",
        "Show governance, monitoring and human review",
    ]),
    ("47_Imbalanced_Learning", "IMBALANCED LEARNING", "rare classes, resampling, class weights, threshold tuning, PR curves and cost-sensitive learning", "imbalanced class histogram, oversampling/undersampling, decision threshold slider, PR curve, confusion matrix", [
        "Accuracy can be misleading under class imbalance",
        "Use precision, recall, F1, PR-AUC and cost-sensitive metrics",
        "Class-weighted loss adjusts penalty by class",
        "Show SMOTE concept with synthetic minority points, labelled as simplified",
    ]),
    ("48_Object_Detection_and_Segmentation", "OBJECT DETECTION AND SEGMENTATION", "bounding boxes, anchors, IoU, NMS, semantic segmentation, instance segmentation and vision evaluation", "image with bounding boxes, segmentation mask, IoU overlap, anchor boxes, NMS sequence, mAP panel", [
        "IoU = area overlap / area union",
        "Non-maximum suppression removes overlapping boxes",
        "Metrics: mAP, precision-recall, pixel accuracy, mean IoU",
        "Distinguish classification, detection and segmentation",
    ]),
    ("49_Seq2Seq_Encoder_Decoder_Models", "SEQ2SEQ ENCODER-DECODER MODELS", "sequence transduction, encoder states, decoder generation, teacher forcing, attention and beam search", "source sequence, encoder, context vector, decoder steps, attention alignment, beam search tree", [
        "Encoder maps input sequence to hidden representations",
        "Decoder predicts output tokens autoregressively",
        "Teacher forcing feeds ground-truth previous token during training",
        "Beam search keeps top candidate sequences during inference",
    ]),
    ("50_Federated_Learning_and_Privacy", "FEDERATED LEARNING AND PRIVACY", "on-device training, secure aggregation, privacy, communication rounds, client drift and decentralized ML", "central server, multiple client devices, local updates, secure aggregation, global model update, privacy boundary", [
        "Clients train local updates on private data",
        "Server aggregates updates, often FedAvg",
        "FedAvg: w_global <- sum_k (n_k/n) w_k",
        "Show privacy limits, poisoning risk and communication constraints",
    ]),
]

BASE_PROMPT_HEADER = """Act as a senior machine-learning infographic designer, AI educator, mathematical visualization specialist and technical illustrator.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{subtitle}

# TARGET LEVEL
{level}

# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic machine-learning infographic
* Extremely sharp formulas, model blocks, tensors, graphs, labels, axes and legends
* Print-quality university AI-lab and research-poster quality
* No blurry text, no fake equations, no incorrect architecture diagrams, no generic AI robot imagery, no watermarks, no logos
"""

COMMON_ASSET = """# VISUAL STYLE
Use a premium technical-poster style with crisp vector diagrams, exact equations, colour-coded data flow, annotated toy examples, real plot panels, architecture blocks, matrix/tensor shapes, training loops and evaluation dashboards.

# CENTRAL HERO VISUAL
Show a large, technically accurate central visual using:
{central}

# REQUIRED FORMULAS AND MATHEMATICAL OBJECTS
Include these formulas or formal objects as readable typeset labels:
{formulas}

# REQUIRED EDUCATIONAL PANELS
Include:
* Input data and shape panel
* Core algorithm idea
* Training or fitting workflow
* Objective/loss/score panel
* Evaluation metrics
* Hyperparameters and assumptions
* Failure modes and common mistakes
* Real-world applications

# STEP-BY-STEP ALGORITHM FLOW
Show this sequence clearly:
* Define the task and data
* State assumptions and variables
* Show the model or algorithm mechanism
* Fit, train or infer parameters
* Produce prediction, cluster, explanation, policy, representation or recommendation
* Evaluate with the correct metric
* Display limitations and failure cases

# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
* Use algorithm-specific visual assets, not generic AI artwork.
* Include at least one formula panel, one toy data visualization, one workflow diagram and one evaluation/failure-mode panel.
* Make every label point to a visible object: matrix, tensor, node, edge, token, feature, cluster, boundary, loss curve, metric, policy, state, action or parameter.
* Distinguish training, validation, testing and inference.
* Include assumptions, hyperparameters, data leakage warnings and ethical/safety notes where relevant.

# ML ACCURACY QA
* Verify every formula, tensor shape, graph, metric, update rule and architecture arrow.
* Do not claim universal superiority.
* Do not imply high accuracy without evaluation.
* Keep arrows computationally meaningful.
* Show train/test separation clearly.
* Include model limitations, failure modes and data requirements.

# FINAL RENDERING REQUIREMENTS
Produce one visually rich, technically accurate and professionally composed 8K infographic suitable for ML courses, AI bootcamps, university teaching, research explainers, interview preparation and digital learning.
"""


VARIANTS = [
    ("01_01_Concept_Map.txt", "Concept Map and Intuition", "Beginner to intermediate"),
    ("02_02_Training_Workflow.txt", "Training Workflow and Evaluation", "Intermediate to advanced"),
    ("03_03_Advanced_Math_and_Architecture.txt", "Advanced Math, Architecture and Research View", "Advanced undergraduate to postgraduate"),
]


def formula_text(lines):
    return "\n".join(f"* {line}" for line in lines)


def insert_existing_formula_blocks():
    updated = 0
    for folder in sorted(BASE.iterdir()):
        if not folder.is_dir() or folder.name not in FORMULA_BLOCKS:
            continue
        block = (
            "\n# REQUIRED FORMULAS, OBJECTIVES AND EXACT VISUALS\n"
            + formula_text(FORMULA_BLOCKS[folder.name])
            + "\n\n"
            + GLOBAL_ENHANCEMENT
            + "\n"
            + QUALITY_APPEND
        )
        for path in folder.glob("*.txt"):
            text = path.read_text(encoding="utf-8")
            if "# REQUIRED FORMULAS, OBJECTIVES AND EXACT VISUALS" in text:
                continue
            marker = "# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS"
            if marker in text:
                text = text.replace(marker, block + "\n" + marker, 1)
            else:
                text = text.rstrip() + "\n" + block
            path.write_text(text, encoding="utf-8")
            updated += 1
    return updated


def create_missing_topics():
    created = 0
    for topic_index, (folder_name, title, summary, central, formulas) in enumerate(NEW_TOPICS, 31):
        folder = BASE / folder_name
        folder.mkdir(parents=True, exist_ok=True)
        for filename, variant_name, level in VARIANTS:
            path = folder / filename
            if path.exists():
                continue
            subtitle = f"{variant_name}: {summary}"
            text = BASE_PROMPT_HEADER.format(title=title, subtitle=subtitle, level=level)
            text += "\n" + COMMON_ASSET.format(central=central, formulas=formula_text(formulas))
            path.write_text(text, encoding="utf-8")
            created += 1
    return created


def main():
    updated = insert_existing_formula_blocks()
    created = create_missing_topics()
    total_files = len(list(BASE.rglob("*.txt")))
    total_folders = len([p for p in BASE.iterdir() if p.is_dir()])
    premium_blocks = sum(1 for p in BASE.rglob("*.txt") if "# PREMIUM NON-GENERIC" in p.read_text(encoding="utf-8"))
    formula_blocks = sum(1 for p in BASE.rglob("*.txt") if "# REQUIRED FORMULAS" in p.read_text(encoding="utf-8"))
    print(f"Enhanced existing prompt files: {updated}")
    print(f"Created new prompt files: {created}")
    print(f"Algorithm folders now: {total_folders}")
    print(f"Text prompt files now: {total_files}")
    print(f"Premium blocks: {premium_blocks}")
    print(f"Formula blocks: {formula_blocks}")


if __name__ == "__main__":
    main()
