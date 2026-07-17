from pathlib import Path

BASE = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts\Ml Algorithms")

QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic machine-learning infographic
* Extremely sharp diagrams, equations, labels, axes, legends, tensors, graphs and model blocks
* Print-quality educational graphics
* Professional university, AI-lab, data-science bootcamp and research-poster quality
* No blurry text
* No fake equations
* No incorrect architecture diagrams
* No distorted symbols
* No watermarks
* No logos
* No stock-image appearance
* No unnecessary visual clutter"""

ASSET_BLOCK = """# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
* Use algorithm-specific assets: data points, decision boundaries, trees, kernels, loss surfaces, gradient arrows, neural network layers, tensors, attention maps, embeddings, confusion matrices, ROC curves, training loops, optimization trajectories and evaluation dashboards.
* Every visual element must teach a specific concept: input, output, parameter, feature, layer, loss, gradient, probability, split rule, kernel, attention score, latent vector, policy, reward or metric.
* Use custom technical diagrams rather than generic AI robot, brain or glowing circuit imagery.
* Make every label anchored to a visible object: node, edge, matrix, vector, axis, tensor, layer, token, split, cluster, distribution, hyperplane, residual, gradient or metric.
* Include assumptions, data shape, feature space, objective function, training/inference distinction and metric definitions where relevant.
* Show multiple representations when useful: intuitive diagram, mathematical formula, pseudocode-style workflow, toy dataset and real-world application.
* Maintain consistent colour coding for data, labels, predictions, errors, parameters, gradients and model outputs.

# ML ACCURACY AND LABEL QA
* Verify every formula, loss function, gradient direction, architecture block, probability expression, metric and algorithm step.
* Do not invent algorithm behaviour or claim universal superiority.
* State assumptions such as linear separability, independence, differentiability, stationarity, labelled data, i.i.d. sampling, Markov property or sufficient data where relevant.
* Distinguish training, validation, testing and inference.
* Distinguish classification, regression, clustering, generation and reinforcement learning.
* Show overfitting, underfitting, bias, variance, leakage and evaluation caveats where relevant.
* Keep arrows computationally meaningful; do not use decorative arrows that imply false data flow.

# NEGATIVE PROMPT
No generic robot heads, no vague glowing brain, no random code wallpaper, no fake neural network, no incorrect tensor shapes, no impossible decision boundary, no unreadable tiny equations, no mislabeled metrics, no training/test leakage, no overclaiming accuracy, no stock-photo appearance, no watermarks, no logos."""

VARIANTS = [
    (
        "01_Concept_Map",
        "Concept Map and Intuition",
        "Beginner to intermediate",
        "Build intuition with what the algorithm does, when to use it, inputs, outputs and core visual idea.",
        "* Central concept map\n* Toy dataset visual\n* Input-output diagram\n* Assumptions panel\n* Strengths and limitations\n* Common mistakes\n* Mini use-case panel",
        "* Start with the data type\n* Define the task\n* Show the model's core idea\n* Show prediction or output\n* Explain what is learned\n* Show where the method works well and where it fails",
    ),
    (
        "02_Training_Workflow",
        "Training Workflow and Evaluation",
        "Intermediate to advanced",
        "Show training pipeline, objective function, optimization, validation and performance metrics.",
        "* Data preprocessing pipeline\n* Model training loop\n* Loss or objective function\n* Hyperparameter panel\n* Validation/testing split\n* Metric dashboard\n* Error analysis panel",
        "* Prepare data\n* Split train/validation/test\n* Initialize model or parameters\n* Compute predictions\n* Measure loss\n* Update parameters or model structure\n* Validate and tune\n* Evaluate on held-out test data",
    ),
    (
        "03_Advanced_Math_and_Architecture",
        "Advanced Math, Architecture and Research View",
        "Advanced undergraduate to postgraduate",
        "Connect the algorithm to formal math, architecture design, optimization, complexity and modern applications.",
        "* Formal objective or probabilistic model\n* Architecture or computation graph\n* Matrix/tensor notation\n* Optimization landscape\n* Complexity or scalability panel\n* Research applications\n* Failure modes and ethics panel",
        "* State assumptions\n* Define variables and objective\n* Derive or sketch the update rule\n* Show architecture or computation graph\n* Analyze complexity or convergence intuition\n* Connect to modern research/application\n* Note limitations and failure modes",
    ),
]

ALGORITHMS = [
    ("Linear_Regression", "LINEAR REGRESSION", "least squares, linear models, residuals, coefficients, assumptions and prediction", "scatter plot, best-fit line, residual arrows, normal equation panel, train/test split, prediction interval"),
    ("Logistic_Regression", "LOGISTIC REGRESSION", "binary classification, sigmoid function, log-odds, decision boundary and cross-entropy", "sigmoid curve, two-class data, linear decision boundary, probability output, confusion matrix"),
    ("K_Nearest_Neighbors", "K-NEAREST NEIGHBOURS", "instance-based learning, distance metrics, local voting, k selection and decision regions", "query point, nearest neighbours, distance circles, class vote panel, decision boundary map"),
    ("Naive_Bayes", "NAIVE BAYES", "Bayes theorem, conditional independence, text classification, likelihoods and posterior probabilities", "Bayes formula flow, feature likelihood table, spam/ham tokens, posterior comparison bars"),
    ("Decision_Trees", "DECISION TREES", "recursive splitting, impurity, entropy, Gini index, pruning and interpretability", "tree diagram, root split, leaf nodes, impurity chart, decision boundary rectangles"),
    ("Random_Forests", "RANDOM FORESTS", "bagging, feature randomness, ensemble voting, out-of-bag error and variable importance", "many decision trees, bootstrap samples, vote aggregation, feature importance bars"),
    ("Gradient_Boosting_XGBoost_LightGBM", "GRADIENT BOOSTING, XGBOOST AND LIGHTGBM", "boosted trees, residual correction, learning rate, regularization and tabular performance", "sequential trees, residual arrows, loss reduction curve, shrinkage panel, feature importance"),
    ("Support_Vector_Machines", "SUPPORT VECTOR MACHINES", "maximum-margin classifiers, support vectors, kernels, soft margin and hyperplanes", "separating hyperplane, margin bands, support vectors, kernel feature-space mapping"),
    ("K_Means_Clustering", "K-MEANS CLUSTERING", "unsupervised clustering, centroids, inertia, assignment-update steps and elbow method", "cluster points, centroids, assignment arrows, centroid movement, elbow plot"),
    ("Hierarchical_Clustering", "HIERARCHICAL CLUSTERING", "agglomerative clustering, dendrograms, linkage criteria and cluster cuts", "dendrogram, distance matrix, cluster merging sequence, cut-height line"),
    ("DBSCAN", "DBSCAN", "density-based clustering, core points, border points, noise and arbitrary-shaped clusters", "density clusters, epsilon radius, minPts, core/border/noise labels, non-spherical clusters"),
    ("Principal_Component_Analysis", "PRINCIPAL COMPONENT ANALYSIS", "dimensionality reduction, variance directions, eigenvectors, projections and explained variance", "2D data cloud, principal axes, projection line, covariance matrix, scree plot"),
    ("Gaussian_Mixture_Models_EM", "GAUSSIAN MIXTURE MODELS AND EM", "soft clustering, mixture distributions, latent variables and expectation-maximization", "overlapping Gaussian ellipses, soft membership colours, EM loop, likelihood curve"),
    ("Neural_Networks_Basics", "NEURAL NETWORKS BASICS", "perceptrons, layers, activations, forward pass, backpropagation and loss minimization", "input layer, hidden layers, output layer, weights, activation functions, backprop arrows"),
    ("Backpropagation_and_Gradient_Descent", "BACKPROPAGATION AND GRADIENT DESCENT", "chain rule, gradients, learning rate, optimization paths, vanishing gradients and training stability", "loss surface, gradient arrows, computation graph, chain-rule panel, learning-rate comparison"),
    ("Convolutional_Neural_Networks", "CONVOLUTIONAL NEURAL NETWORKS", "convolutions, filters, feature maps, pooling, receptive fields and image classification", "image grid, convolution kernel, feature maps, pooling layer, CNN architecture blocks"),
    ("Recurrent_Neural_Networks_LSTM_GRU", "RNNs, LSTMs AND GRUs", "sequence modelling, hidden states, gates, memory, time steps and vanishing gradients", "unrolled RNN, hidden state arrows, LSTM gates, sequence input/output, gradient flow"),
    ("Transformers_and_Attention", "TRANSFORMERS AND ATTENTION", "self-attention, tokens, queries, keys, values, positional encoding and encoder-decoder blocks", "token embeddings, Q-K-V matrices, attention heatmap, multi-head attention, transformer block"),
    ("Large_Language_Models", "LARGE LANGUAGE MODELS", "tokenization, next-token prediction, pretraining, fine-tuning, context windows and generation", "token stream, embedding vectors, transformer stack, logits, softmax, generated text path"),
    ("Autoencoders_and_Representation_Learning", "AUTOENCODERS AND REPRESENTATION LEARNING", "encoders, latent space, decoders, reconstruction loss and anomaly detection", "encoder bottleneck decoder, latent space map, reconstruction comparison, anomaly score"),
    ("Variational_Autoencoders", "VARIATIONAL AUTOENCODERS", "probabilistic latent variables, encoder distributions, reparameterization trick and generative sampling", "latent distribution, mu/sigma vectors, sampling node, decoder output, KL loss panel"),
    ("Generative_Adversarial_Networks", "GENERATIVE ADVERSARIAL NETWORKS", "generator, discriminator, adversarial training, latent noise and image generation", "generator-discriminator duel, latent vector, fake/real samples, adversarial loss curves"),
    ("Diffusion_Models", "DIFFUSION MODELS", "forward noise process, denoising, score prediction, sampling steps and image generation", "image-to-noise chain, denoising U-Net, timestep embeddings, reverse sampling sequence"),
    ("Reinforcement_Learning_Basics", "REINFORCEMENT LEARNING BASICS", "agents, environments, states, actions, rewards, policies and value functions", "agent-environment loop, state-action-reward arrows, policy map, value grid"),
    ("Q_Learning_and_Deep_Q_Networks", "Q-LEARNING AND DEEP Q-NETWORKS", "Bellman updates, Q-values, exploration, replay buffers and target networks", "gridworld, Q-table, Bellman equation, epsilon-greedy path, replay buffer, DQN network"),
    ("Policy_Gradient_and_Actor_Critic", "POLICY GRADIENT AND ACTOR-CRITIC", "stochastic policies, returns, gradients, value baselines, actor-critic architecture and advantage", "actor network, critic network, trajectory rewards, policy gradient arrow, advantage estimate"),
    ("Model_Evaluation_and_Metrics", "MODEL EVALUATION AND METRICS", "accuracy, precision, recall, F1, ROC-AUC, calibration, regression metrics and validation design", "confusion matrix, ROC curve, PR curve, calibration plot, residual plot, train-validation-test split"),
    ("Overfitting_Regularization_and_Generalization", "OVERFITTING, REGULARIZATION AND GENERALIZATION", "bias-variance tradeoff, regularization, dropout, early stopping, data augmentation and validation", "underfit/goodfit/overfit curves, train-validation loss, dropout mask, regularization penalty"),
    ("Feature_Engineering_and_Preprocessing", "FEATURE ENGINEERING AND PREPROCESSING", "scaling, encoding, missing values, leakage prevention, pipelines and feature selection", "raw data table, preprocessing pipeline, one-hot encoding, standardization graph, leakage warning panel"),
    ("MLOps_Model_Deployment_and_Monitoring", "MLOPS, MODEL DEPLOYMENT AND MONITORING", "model serving, versioning, pipelines, drift, monitoring, retraining and responsible AI operations", "training pipeline, model registry, API serving, monitoring dashboard, data drift graph, retraining loop"),
]


SPECIAL = {
    "TRANSFORMERS AND ATTENTION": "* Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V must be shown correctly\n* Query, key and value roles must be distinct\n* Positional encoding should be shown as added to token embeddings\n* Do not imply attention is human-like understanding",
    "LARGE LANGUAGE MODELS": "* Show next-token prediction as probabilistic, not deterministic truth generation\n* Distinguish pretraining, fine-tuning and inference\n* Include hallucination, bias, context limit and evaluation caveats\n* Do not show LLMs as conscious brains",
    "DIFFUSION MODELS": "* Forward process adds noise; reverse process denoises step by step\n* Do not show one-step magic image creation unless labelled as simplified\n* Clarify that training predicts noise, score or denoised representation depending on formulation\n* Keep timestep ordering clear",
    "GENERATIVE ADVERSARIAL NETWORKS": "* Generator and discriminator have different objectives\n* Do not show discriminator improving generated images directly; it supplies training signal\n* Include instability and mode collapse caveats\n* Show real and generated data distributions distinctly",
    "REINFORCEMENT LEARNING BASICS": "* Markov decision process terms must be used correctly\n* Reward is not always immediate success\n* Policy, value function and environment must be distinct\n* Avoid implying RL is always sample efficient",
    "MODEL EVALUATION AND METRICS": "* Accuracy can be misleading on imbalanced data\n* Precision and recall must be defined correctly\n* ROC-AUC and PR-AUC should not be confused\n* Test data must remain held out",
}


def make_prompt(title, subtitle, level, focus, central, panels, process, accuracy):
    return f"""Act as a senior machine-learning infographic designer, AI educator, mathematical visualization specialist and technical illustrator.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{subtitle}

# TARGET LEVEL
{level}

{QUALITY}

# VISUAL STYLE
Use a premium modern AI/ML infographic style combining clean vector diagrams, precise mathematical notation, colour-coded data flow, annotated toy examples, graph dashboards, architecture blocks, matrix/tensor visuals, training-loop diagrams and strong visual hierarchy.

# CORE FOCUS
{focus}

# CENTRAL HERO VISUAL
Show a large, technically accurate central visual using:
{central}

# REQUIRED EDUCATIONAL PANELS
Include:
{panels}

# STEP-BY-STEP ALGORITHM FLOW
Show this sequence clearly:
{process}

# APPLICATIONS OR CONNECTIONS
Include:
* Real-world use cases
* Data requirements
* Strengths and limitations
* Evaluation metrics
* Failure modes
* Ethical or safety considerations where relevant

# COMPOSITION
Top: title, subtitle and level label.
Centre: large hero algorithm diagram, model architecture or decision visualization.
Upper left: input data, notation and assumptions.
Upper right: objective function, formula or core algorithm rule.
Lower left: training workflow or worked toy example.
Lower right: evaluation, application and failure modes.
Bottom strip: key facts, common mistakes, metric legend and quick review.

# TYPOGRAPHY
* Bold modern sans-serif headings
* Clear mathematical and code-like notation
* Large readable equations
* Consistent variable names
* Correct superscripts, subscripts, Greek letters, matrix notation and probability symbols
* No text overlapping diagrams, tensors, graphs or architecture blocks

# ALGORITHM-SPECIFIC ACCURACY REQUIREMENTS
{accuracy}

{ASSET_BLOCK}

# FINAL RENDERING REQUIREMENTS
Produce one visually rich, technically accurate and professionally composed 8K infographic suitable for ML courses, AI bootcamps, university teaching, research explainers, interview preparation and digital learning.
"""


def main():
    created = 0
    for idx, (slug, title, summary, central) in enumerate(ALGORITHMS, 1):
        folder = BASE / f"{idx:02d}_{slug}"
        folder.mkdir(parents=True, exist_ok=True)
        for v_idx, (v_slug, v_name, level, focus, panels, process) in enumerate(VARIANTS, 1):
            accuracy = SPECIAL.get(
                title,
                "* Keep training and inference visually distinct\n* State assumptions and data requirements\n* Do not claim the algorithm is best for every dataset\n* Show evaluation on held-out data\n* Include common failure modes",
            )
            path = folder / f"{v_idx:02d}_{v_slug}.txt"
            text = make_prompt(
                title=title,
                subtitle=f"{v_name}: {summary}",
                level=level,
                focus=focus,
                central=central,
                panels=panels,
                process=process,
                accuracy=accuracy,
            )
            path.write_text(text, encoding="utf-8")
            created += 1
    print(f"Created {created} ML/deep-learning infographic prompt files in {BASE}")
    print(f"Algorithm folders: {len([p for p in BASE.iterdir() if p.is_dir()])}")


if __name__ == "__main__":
    main()
