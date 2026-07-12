import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Camera, CheckCircle2, Compass, Cuboid, HelpCircle, Minus, Move3D, Plus, RotateCcw, RotateCcwSquare, RotateCwSquare, Ruler, ScanLine, Sparkles, Waves, X } from "lucide-react";
import SmartMathInput from "../components/math-input/SmartMathInput";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import { classifyEquationInput } from "../ar-math-lab/arEquationClassifier";
import { arExampleGroups, arMathExamples } from "../ar-math-lab/arExamples";
import { arPracticeActivities } from "../ar-math-lab/arPracticeActivities";
import { calculateDisplayScale, crossSectionLabel, parseGeometrySolidInput, qualitySegments, solidTypeLabels, updateGeometryDimension } from "../ar-math-lab/arGeometrySolids";
import { defaultGraphSettings, generateARGraphObject, parameterSliderSpecs, settingsFromClassification } from "../ar-math-lab/arGraphGenerator";
import { comparisonSummary, createAnimation, createMeasurement, createObjectDimensionMeasurement, feedbackFor, lessonFor, parseSceneJson, serializeScene } from "../ar-math-lab/arInteractiveTools";
import { createARLearningEvent, type ARLearningEvent, type ARLearningEventType } from "../ar-math-lab/arLearningEngine";
import { applyPerformanceModeToGraphSettings, hasHighResolutionRisk } from "../ar-math-lab/arProductionHardening";
import { detectARSupport } from "../ar-math-lab/arSupport";
import type { ARAdvancedToolTab, ARAnimation, ARComparison, ARCrossSectionMode, ARExample, ARGeneratedGeometrySolid, ARGeneratedGraphObject, ARGeometryQuality, ARGraphSettings, ARMathObject, ARMeasurement, ARMeasurementType, ARObjectType, ARRenderMode, ARScaleMode, ARSceneSaveData, ARSceneState, ARSessionState, ARSessionStatus, ARSolidType, ARSupportStatus, ARUnit, EquationClassificationResult } from "../ar-math-lab/types";

const initialExample = arMathExamples[0];
const objectTypeLabels: Record<ARObjectType, string> = {
  explicit_surface: "Explicit surface",
  parametric_surface: "Parametric surface",
  parametric_curve: "Parametric curve",
  implicit_surface: "Implicit surface",
  recognized_implicit_shape: "Recognized implicit shape",
  implicit_surface_unsupported: "Unsupported implicit surface",
  geometry_solid: "Geometry solid",
  coordinate_axes: "Coordinate axes",
  measurement_demo: "Measurement demo",
  unknown: "Unknown",
};

const unitOptions: ARUnit[] = ["mm", "cm", "m", "inch", "ft"];
const scaleModeLabels: Record<ARScaleMode, string> = {
  "real-scale": "Real Scale",
  "fit-to-view": "Fit to View",
  "classroom-scale": "Classroom Scale",
  miniature: "Miniature",
  custom: "Custom Scale",
};
const crossSectionLabels: Record<ARCrossSectionMode, string> = {
  off: "Off",
  horizontal: "Horizontal",
  vertical: "Vertical",
};
const advancedTabs: Array<{ id: ARAdvancedToolTab; label: string }> = [
  { id: "build", label: "Build" },
  { id: "graph", label: "Graph" },
  { id: "geometry", label: "Geometry" },
  { id: "measure", label: "Measure" },
  { id: "animate", label: "Animate" },
  { id: "formula", label: "Formula" },
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Practice" },
  { id: "compare", label: "Compare" },
  { id: "scene", label: "Scene" },
  { id: "settings", label: "Settings" },
];
const measurementTypes: ARMeasurementType[] = ["distance", "height", "radius", "diameter", "slant_height", "angle", "point_coordinate", "surface_value", "cross_section_dimension"];

const checkingSupport: ARSupportStatus = {
  webXRAvailable: false,
  immersiveARSupported: false,
  cameraAvailable: false,
  webGLAvailable: false,
  isSecureContext: false,
  recommendedMode: "3d-preview",
  warnings: [],
  message: "Checking browser AR, camera, and WebGL support.",
  hasNavigatorXR: false,
  secureContext: false,
  notes: ["Checking browser AR, camera, and WebGL support."],
};

const initialSceneState: ARSceneState = {
  showGrid: true,
  showAxes: true,
  showLabels: true,
  placementReady: false,
  selectedObjectId: "phase-2-preview-object",
  objectScale: 1,
  objectRotation: [0, 0, 0],
  objectPosition: [0, 0.45, 0],
};

function createSessionState(support: ARSupportStatus, status: ARSessionStatus = "ready"): ARSessionState {
  return {
    mode: "3d-preview",
    status,
    webXRAvailable: support.webXRAvailable,
    immersiveARSupported: support.immersiveARSupported,
    cameraAvailable: support.cameraAvailable,
    cameraPermission: "unknown",
    isSecureContext: support.isSecureContext,
    infoMessage: support.message,
  };
}

export default function ARMathLab() {
  const [selectedExampleId, setSelectedExampleId] = useState(initialExample.id);
  const [input, setInput] = useState(initialExample.input);
  const [, setSupport] = useState<ARSupportStatus>(checkingSupport);
  const [sessionState, setSessionState] = useState<ARSessionState>(() => createSessionState(checkingSupport, "checking"));
  const [sceneState, setSceneState] = useState<ARSceneState>(initialSceneState);
  const [objectType, setObjectType] = useState<ARObjectType>(initialExample.objectType);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [graphSettings, setGraphSettings] = useState<ARGraphSettings>(() => ({ ...defaultGraphSettings, ...(initialExample.recommended ?? {}) }));
  const [parameterValues, setParameterValues] = useState<Record<string, number>>(initialExample.parameters ?? {});
  const [generatedGraphs, setGeneratedGraphs] = useState<ARGeneratedGraphObject[]>([]);
  const [selectedGraphId, setSelectedGraphId] = useState<string | undefined>();
  const [graphError, setGraphError] = useState("");
  const [generatedSolids, setGeneratedSolids] = useState<ARGeneratedGeometrySolid[]>([]);
  const [selectedSolidId, setSelectedSolidId] = useState<string | undefined>();
  const [geometryError, setGeometryError] = useState("");
  const [geometryBuilderType, setGeometryBuilderType] = useState<ARSolidType>("cone");
  const [geometryBuilderUnit, setGeometryBuilderUnit] = useState<ARUnit>("cm");
  const [activeToolTab, setActiveToolTab] = useState<ARAdvancedToolTab>("build");
  const [measurements, setMeasurements] = useState<ARMeasurement[]>([]);
  const [measurementMode, setMeasurementMode] = useState<ARMeasurementType | "off">("off");
  const [animations, setAnimations] = useState<ARAnimation[]>([]);
  const [comparison, setComparison] = useState<ARComparison>({ enabled: false, mode: "side-by-side", syncScale: true });
  const [teacherMode, setTeacherMode] = useState(false);
  const [sceneMessage, setSceneMessage] = useState("");
  const [savedSceneName, setSavedSceneName] = useState("AR Math Lab Scene");
  const [importSceneJson, setImportSceneJson] = useState("");
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  const [isGeneratingSolid, setIsGeneratingSolid] = useState(false);
  const [lastLearningEvent, setLastLearningEvent] = useState<ARLearningEvent>(() => createARLearningEvent("equation_entered", undefined, { input: initialExample.input }));
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const mountedRef = useRef(true);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const selectedExample = useMemo(() => arMathExamples.find((example) => example.id === selectedExampleId) ?? initialExample, [selectedExampleId]);
  const classification = useMemo(() => classifyEquationInput(input), [input]);
  const selectedGraph = useMemo(() => generatedGraphs.find((graph) => graph.id === selectedGraphId), [generatedGraphs, selectedGraphId]);
  const selectedSolid = useMemo(() => generatedSolids.find((solid) => solid.id === selectedSolidId), [generatedSolids, selectedSolidId]);
  const parameterSpecs = useMemo(() => parameterSliderSpecs(classification.parameters ?? []), [classification.parameters]);
  const selectedObjectId = selectedSolid?.id ?? selectedGraph?.id;
  const selectedLesson = useMemo(() => lessonFor(selectedGraph, selectedSolid), [selectedGraph, selectedSolid]);
  const recommendations = useMemo(() => feedbackFor(input, selectedGraph, selectedSolid), [input, selectedGraph, selectedSolid]);
  const comparisonText = useMemo(() => comparisonSummary(comparison, generatedGraphs, generatedSolids), [comparison, generatedGraphs, generatedSolids]);
  const currentObject = useMemo<ARMathObject>(() => ({
    id: selectedSolid?.id ?? selectedGraph?.id ?? "phase-2-preview-object",
    label: selectedSolid?.name ?? selectedGraph?.name ?? selectedExample.title,
    input,
    type: selectedSolid?.type ?? selectedGraph?.type ?? classification.type,
    classification: selectedGraph?.classification ?? classification,
    renderMode: sessionState.mode === "none" ? "3d-preview" : sessionState.mode,
  }), [classification, input, selectedExample.title, selectedGraph, selectedSolid, sessionState.mode]);

  useEffect(() => {
    const defaults = classification.suggestedParameters ?? {};
    setParameterValues((values) => {
      const next = { ...values };
      Object.entries(defaults).forEach(([key, value]) => {
        if (next[key] === undefined) next[key] = value;
      });
      return next;
    });
  }, [classification.suggestedParameters]);

  useEffect(() => {
    let mounted = true;
    detectARSupport().then((status) => {
      if (!mounted) return;
      setSupport(status);
      setSessionState(createSessionState(status));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => () => {
    mountedRef.current = false;
    releaseCameraStream();
  }, []);

  useEffect(() => {
    const stopLiveMedia = () => {
      releaseCameraStream();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setAnimations((items) => items.map((animation) => animation.status === "playing" ? { ...animation, status: "paused" } : animation));
        stopLiveMedia();
        setCameraStream(null);
        setSessionState((state) => state.mode === "camera-preview" || state.mode === "ar"
          ? { ...state, mode: "3d-preview", status: "ready", infoMessage: "Camera and AR session closed while the app was hidden." }
          : state);
        setSceneMessage("Animations paused and live camera resources closed while this tab is hidden.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", stopLiveMedia);
    window.addEventListener("beforeunload", stopLiveMedia);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", stopLiveMedia);
      window.removeEventListener("beforeunload", stopLiveMedia);
    };
  }, []);

  useEffect(() => {
    setAnimations((items) => items.filter((animation) => generatedGraphs.some((graph) => graph.id === animation.objectId) || generatedSolids.some((solid) => solid.id === animation.objectId)));
    setMeasurements((items) => items.filter((measurement) => !measurement.objectId || generatedGraphs.some((graph) => graph.id === measurement.objectId) || generatedSolids.some((solid) => solid.id === measurement.objectId)));
  }, [generatedGraphs, generatedSolids]);

  useEffect(() => {
    if (!animations.some((animation) => animation.status === "playing")) return;
    let frame = 0;
    let lastFrameTime = 0;
    const frameInterval = performanceMode ? 120 : 48;
    const tick = (time: number) => {
      if (document.visibilityState === "hidden") return;
      if (time - lastFrameTime >= frameInterval) {
        lastFrameTime = time;
        const active = animations.filter((animation) => animation.status === "playing" && (generatedSolids.some((solid) => solid.id === animation.objectId) || generatedGraphs.some((graph) => graph.id === animation.objectId)));
        if (active.some((animation) => animation.target === "rotation")) {
          setSceneState((state) => ({ ...state, objectRotation: [state.objectRotation[0], roundTo(state.objectRotation[1] + (performanceMode ? 0.06 : 0.1), 2), state.objectRotation[2]] }));
        }
        active.filter((animation) => animation.target === "cross_section").forEach((animation) => {
          setGeneratedSolids((solids) => solids.map((solid) => solid.id === animation.objectId ? { ...solid, settings: { ...solid.settings, showCrossSection: true, crossSectionMode: solid.settings.crossSectionMode === "off" ? "horizontal" : solid.settings.crossSectionMode, crossSectionPosition: (solid.settings.crossSectionPosition + (performanceMode ? 0.03 : 0.05)) % 1 } } : solid));
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animations, generatedGraphs, generatedSolids, performanceMode]);

  function emitLearning(type: ARLearningEventType, objectId = selectedObjectId, payload?: Record<string, unknown>) {
    setLastLearningEvent(createARLearningEvent(type, objectId, payload));
  }

  function selectGraph(id: string | undefined) {
    setSelectedGraphId(id);
    if (id) {
      setSelectedSolidId(undefined);
      emitLearning("object_selected", id);
    }
  }

  function selectSolid(id: string | undefined) {
    setSelectedSolidId(id);
    if (id) {
      setSelectedGraphId(undefined);
      emitLearning("object_selected", id);
    }
  }

  function handleExampleChange(exampleId: string) {
    const example = arMathExamples.find((item) => item.id === exampleId) ?? initialExample;
    setSelectedExampleId(example.id);
    setInput(example.input);
    setObjectType(example.objectType);
    const nextClassification = classifyEquationInput(example.input);
    setGraphSettings({ ...settingsFromClassification(nextClassification), ...(example.recommended ?? {}) });
    setParameterValues({ ...(nextClassification.suggestedParameters ?? {}), ...(example.parameters ?? {}) });
    if (example.solidType) setGeometryBuilderType(example.solidType);
    if (example.unit) setGeometryBuilderUnit(example.unit);
    setGraphError("");
    setGeometryError("");
    emitLearning("equation_entered", undefined, { input: example.input, exampleId: example.id });
  }

  async function startARSession() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setSessionState((state) => ({ ...state, mode: "3d-preview", status: "unsupported", cameraPermission: "denied", errorMessage: "Camera access is not available in this browser.", infoMessage: "3D Preview Mode is active." }));
      return;
    }
    await startCameraBackedMode("ar", "Camera AR is active.", "browser-camera-ar");
  }

  async function stopARSession() {
    setSessionState((state) => ({ ...state, status: "stopping", infoMessage: "Ending AR session..." }));
    releaseCameraStream();
    setCameraStream(null);
    setSessionState((state) => ({ ...state, mode: "3d-preview", status: "ready", infoMessage: "AR session ended. 3D Preview Mode is active." }));
    emitLearning("mode_changed", selectedObjectId, { mode: "3d-preview" });
  }

  async function startCameraPreview() {
    await startCameraBackedMode("camera-preview", "Camera is active.", "camera-preview");
  }

  async function startCameraBackedMode(mode: "ar" | "camera-preview", infoMessage: string, reason: string) {
    if (!navigator.mediaDevices?.getUserMedia) {
      setSessionState((state) => ({ ...state, mode: "3d-preview", status: "unsupported", cameraPermission: "denied", errorMessage: "Camera access is not available in this browser.", infoMessage: "3D Preview Mode is active." }));
      return;
    }
    setSessionState((state) => ({ ...state, mode, status: "starting", cameraPermission: "prompt", errorMessage: undefined, infoMessage: "Requesting rear camera permission..." }));
    try {
      releaseCameraStream();
      const stream = await requestEnvironmentCameraStream();
      if (!mountedRef.current) {
        stopCameraTracks(stream);
        return;
      }
      cameraStreamRef.current = stream;
      setCameraStream(stream);
      setSessionState((state) => ({ ...state, mode, status: "active", cameraPermission: "granted", errorMessage: undefined, infoMessage }));
      emitLearning("mode_changed", selectedObjectId, { mode, reason });
    } catch (error) {
      releaseCameraStream();
      setCameraStream(null);
      setSessionState((state) => ({ ...state, mode: "3d-preview", status: "error", cameraPermission: "denied", errorMessage: cameraErrorMessage(error), infoMessage: "3D Preview Mode is active." }));
      emitLearning("error_occurred", selectedObjectId, { area: mode, message: cameraErrorMessage(error), reason });
    }
  }

  async function stopCameraPreview(showMessage = true) {
    releaseCameraStream();
    setCameraStream(null);
    if (showMessage) {
      setSessionState((state) => ({ ...state, mode: "3d-preview", status: "ready", infoMessage: "Camera preview ended. 3D Preview Mode is active." }));
      emitLearning("mode_changed", selectedObjectId, { mode: "3d-preview" });
    }
  }

  function activate3DPreview(message = "3D Preview Mode is active. Start AR to use the live mobile camera.") {
    releaseCameraStream();
    setCameraStream(null);
    setSessionState((state) => ({ ...state, mode: "3d-preview", status: "active", errorMessage: undefined, infoMessage: message }));
    emitLearning("mode_changed", selectedObjectId, { mode: "3d-preview" });
  }

  function releaseCameraStream() {
    stopCameraTracks(cameraStreamRef.current);
    cameraStreamRef.current = null;
  }

  function exitActiveMode() {
    if (sessionState.mode === "ar") {
      stopARSession();
      return;
    }
    if (sessionState.mode === "camera-preview") {
      stopCameraPreview();
      return;
    }
    activate3DPreview();
  }

  function resetScene() {
    setSceneState(initialSceneState);
    setSessionState((state) => ({ ...state, infoMessage: "Scene reset. Grid, axes, labels, and preview transform restored." }));
  }

  function placeObject() {
    const messages: Record<ARRenderMode, string> = {
      ar: selectedSolid ? "Geometry solid placed in the AR preview position." : selectedGraph ? "Generated graph placed in the AR preview position." : "Object placed. Generate a graph or solid to replace the preview object.",
      "camera-preview": "Object placed in camera preview overlay mode.",
      "3d-preview": "Object placed in 3D preview.",
    };
    setSceneState((state) => ({ ...state, placementReady: true, selectedObjectId: currentObject.id }));
    setSessionState((state) => ({ ...state, infoMessage: messages[state.mode === "none" ? "3d-preview" : state.mode] }));
    emitLearning("object_placed", currentObject.id, { mode: sessionState.mode === "none" ? "3d-preview" : sessionState.mode });
  }

  function generateGraph() {
    if (hasHighResolutionRisk(graphSettings) && !window.confirm("High resolution may slow down this device. Continue?")) {
      setSceneMessage("Graph generation cancelled. Lower the resolution or enable Performance Mode.");
      emitLearning("error_occurred", selectedObjectId, { area: "graph-generation", message: "High resolution cancelled" });
      return;
    }
    setIsGeneratingGraph(true);
    try {
      const effectiveSettings = applyPerformanceModeToGraphSettings(graphSettings, performanceMode);
      const graph = { ...generateARGraphObject(input, effectiveSettings, parameterValues), status: "ready" as const };
      setGeneratedGraphs((graphs) => [graph, ...graphs.filter((item) => item.id !== selectedGraphId)]);
      setSelectedGraphId(graph.id);
      setSelectedSolidId(undefined);
      setGraphError("");
      setSceneState((state) => ({ ...state, placementReady: true, selectedObjectId: graph.id }));
      setSessionState((state) => ({ ...state, errorMessage: undefined, infoMessage: `${graph.name} generated. It is ready in ${state.mode === "none" ? "3D preview" : state.mode}.` }));
      emitLearning("graph_generated", graph.id, { equation: graph.equation, renderer: graph.geometry.kind });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The equation could not be parsed. Check brackets, operators, and variables.";
      setGraphError(message);
      setSessionState((state) => ({ ...state, errorMessage: message, infoMessage: "No graph was generated." }));
      emitLearning("error_occurred", selectedObjectId, { area: "graph-generation", message });
    } finally {
      setIsGeneratingGraph(false);
    }
  }

  function deleteSelectedGraph() {
    if (!selectedGraphId) return;
    setGeneratedGraphs((graphs) => graphs.filter((graph) => graph.id !== selectedGraphId));
    setAnimations((items) => items.filter((animation) => animation.objectId !== selectedGraphId));
    setMeasurements((items) => items.filter((measurement) => measurement.objectId !== selectedGraphId));
    setSelectedGraphId(undefined);
    setSessionState((state) => ({ ...state, infoMessage: "Graph deleted. The preview scene remains available." }));
  }

  function generateSolid() {
    setIsGeneratingSolid(true);
    const parsed = parseGeometrySolidInput(input, geometryBuilderUnit);
    if (!parsed.ok) {
      setGeometryError(parsed.message);
      setSessionState((state) => ({ ...state, errorMessage: parsed.message, infoMessage: "No geometry solid was generated." }));
      setIsGeneratingSolid(false);
      emitLearning("error_occurred", selectedObjectId, { area: "geometry-generation", message: parsed.message });
      return;
    }
    const solid = {
      ...parsed.solid,
      displayScaleMode: selectedExample.recommendedScaleMode ?? parsed.solid.displayScaleMode,
      status: parsed.solid.warnings.length ? "warning" as const : "ready" as const,
      settings: {
        ...parsed.solid.settings,
        quality: performanceMode ? "low" as const : parsed.solid.settings.quality,
        showLabels: performanceMode ? false : parsed.solid.settings.showLabels,
      },
    };
    setGeneratedSolids((solids) => [solid, ...solids.filter((item) => item.id !== selectedSolidId)]);
    setSelectedSolidId(solid.id);
    setSelectedGraphId(undefined);
    setGeometryBuilderType(solid.solidType);
    setGeometryBuilderUnit(solid.unit);
    setGeometryError("");
    setSceneState((state) => ({ ...state, placementReady: true, selectedObjectId: solid.id }));
    setSessionState((state) => ({ ...state, errorMessage: undefined, infoMessage: `${solid.name} generated. Original dimensions are preserved. Only the AR display scale has changed.` }));
    emitLearning("geometry_created", solid.id, { solidType: solid.solidType });
    setIsGeneratingSolid(false);
  }

  function deleteSelectedSolid() {
    if (!selectedSolidId) return;
    setGeneratedSolids((solids) => solids.filter((solid) => solid.id !== selectedSolidId));
    setAnimations((items) => items.filter((animation) => animation.objectId !== selectedSolidId));
    setMeasurements((items) => items.filter((measurement) => measurement.objectId !== selectedSolidId));
    setSelectedSolidId(undefined);
    setSessionState((state) => ({ ...state, infoMessage: "Geometry solid deleted. Graph and fallback previews remain available." }));
  }

  function duplicateSelectedSolid() {
    if (!selectedSolid) return;
    const duplicate = { ...selectedSolid, id: `ar-solid-${Date.now()}`, name: `${selectedSolid.name} copy`, locked: false };
    setGeneratedSolids((solids) => [duplicate, ...solids]);
    setSelectedSolidId(duplicate.id);
  }

  function updateSelectedSolidDimensions(key: string, value: number) {
    setGeneratedSolids((solids) => solids.map((solid) => solid.id === selectedSolidId ? updateGeometryDimension(solid, key, value) : solid));
    emitLearning("geometry_dimension_changed", selectedSolidId, { key, value });
  }

  function updateSelectedSolidSettings(delta: Partial<ARGeneratedGeometrySolid["settings"]>) {
    setGeneratedSolids((solids) => solids.map((solid) => solid.id === selectedSolidId ? { ...solid, settings: { ...solid.settings, ...delta } } : solid));
    if ("showCrossSection" in delta || "crossSectionMode" in delta || "crossSectionPosition" in delta) emitLearning("cross_section_changed", selectedSolidId, delta as Record<string, unknown>);
  }

  function updateSelectedSolidScale(mode: ARScaleMode) {
    setGeneratedSolids((solids) => solids.map((solid) => solid.id === selectedSolidId ? { ...solid, displayScaleMode: mode } : solid));
    setSessionState((state) => ({ ...state, infoMessage: "Original dimensions are preserved. Only the AR display scale has changed." }));
    emitLearning("scale_mode_changed", selectedSolidId, { mode });
  }

  function updateSelectedSolidCustomScale(value: number) {
    setGeneratedSolids((solids) => solids.map((solid) => solid.id === selectedSolidId ? { ...solid, customScale: value, displayScaleMode: "custom" } : solid));
    emitLearning("scale_mode_changed", selectedSolidId, { mode: "custom", value });
  }

  function addMeasurement(type: ARMeasurementType = measurementMode === "off" ? "distance" : measurementMode) {
    if (!selectedObjectId) {
      setSceneMessage("Select an object before adding a measurement.");
      return;
    }
    const dimensionKey = type === "slant_height" ? "slantHeight" : type === "edge_length" ? "side" : type;
    const measurement = selectedSolid && ["height", "radius", "diameter", "slant_height", "edge_length"].includes(type)
      ? createObjectDimensionMeasurement(selectedSolid, dimensionKey)
      : createMeasurement(type, selectedObjectId, selectedSolid?.unit ?? "units");
    setMeasurements((items) => [measurement, ...items]);
    setSceneMessage(`${measurement.label} added.`);
    emitLearning("measurement_added", measurement.objectId, { type: measurement.type, value: measurement.value, unit: measurement.unit });
  }

  function clearMeasurements() {
    setMeasurements([]);
    setSceneMessage("Measurements cleared.");
  }

  function addAnimation(target: ARAnimation["target"] = selectedSolid ? "dimension" : "rotation") {
    if (!selectedObjectId) {
      setSceneMessage("Select an object before creating an animation.");
      return;
    }
    const property = target === "dimension" ? Object.keys(selectedSolid?.dimensions ?? {})[0] ?? "radius" : target === "parameter" ? parameterSpecs[0]?.key ?? "a" : target;
    setAnimations((items) => [createAnimation(selectedObjectId, target, property), ...items]);
    setSceneMessage("Animation created. Press Play to start.");
  }

  function updateAnimationStatus(id: string, status: ARAnimation["status"]) {
    setAnimations((items) => items.map((animation) => animation.id === id ? { ...animation, status } : animation));
    const animation = animations.find((item) => item.id === id);
    if (status === "playing") emitLearning("animation_started", animation?.objectId, { target: animation?.target, property: animation?.property });
    if (status === "paused") emitLearning("animation_paused", animation?.objectId, { target: animation?.target, property: animation?.property });
    if (status === "stopped") emitLearning("animation_completed", animation?.objectId, { target: animation?.target, property: animation?.property });
  }

  function saveScene() {
    const scene = serializeCurrentScene();
    localStorage.setItem(`ar-math-lab-scene:${savedSceneName}`, JSON.stringify(scene));
    setSceneMessage(`Saved scene: ${savedSceneName}`);
  }

  function loadScene() {
    const raw = localStorage.getItem(`ar-math-lab-scene:${savedSceneName}`);
    if (!raw) {
      setSceneMessage("No saved scene found with that name.");
      return;
    }
    restoreScene(raw);
  }

  function exportSceneJson() {
    const scene = serializeCurrentScene();
    const json = JSON.stringify(scene, null, 2);
    setImportSceneJson(json);
    navigator.clipboard?.writeText(json).then(() => setSceneMessage("Scene JSON copied to clipboard.")).catch(() => setSceneMessage("Scene JSON is ready in the import/export box."));
  }

  function importScene() {
    restoreScene(importSceneJson);
  }

  function restoreScene(raw: string) {
    try {
      const scene = parseSceneJson(raw);
      setGeneratedGraphs(scene.graphs);
      setGeneratedSolids(scene.solids);
      setMeasurements(scene.measurements);
      setAnimations(scene.animations);
      setComparison(scene.comparison);
      setSceneState((state) => ({ ...state, showGrid: scene.settings.showGrid, showAxes: scene.settings.showAxes, showLabels: scene.settings.showLabels }));
      if (scene.learning?.quizResults) setQuizResults(scene.learning.quizResults);
      if (scene.learning?.lastEvent && isLearningEventType(scene.learning.lastEvent.type)) setLastLearningEvent({ ...scene.learning.lastEvent, type: scene.learning.lastEvent.type });
      setSceneMessage(scene.learning ? "Scene and learning state loaded." : "Scene loaded.");
    } catch {
      setSceneMessage("Invalid scene file. Please import a valid AR Math Lab JSON scene.");
    }
  }

  function serializeCurrentScene(): ARSceneSaveData {
    return serializeScene({
      graphs: generatedGraphs,
      solids: generatedSolids,
      measurements,
      animations,
      comparison,
      settings: { showGrid: sceneState.showGrid, showAxes: sceneState.showAxes, showLabels: sceneState.showLabels },
      learning: {
        activeConcept: selectedLesson.title,
        completedStepIds: [],
        quizResults,
        lastEvent: lastLearningEvent,
      },
    });
  }

  function captureScene() {
    const canvas = document.querySelector("[data-testid='ar-fallback-viewer'] canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      setSceneMessage("Open 3D Preview Mode before capturing a scene screenshot.");
      return;
    }
    try {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${savedSceneName || "ar-math-lab-scene"}.png`;
      link.click();
      setSceneMessage("Scene screenshot downloaded.");
    } catch {
      setSceneMessage("Screenshot capture was blocked by this browser. Try the built-in browser screenshot controls.");
    }
  }

  function resetGraphSettings() {
    const next = settingsFromClassification(classification);
    setGraphSettings(next);
    setParameterValues(classification.suggestedParameters ?? {});
  }

  function updateGraphSetting<K extends keyof ARGraphSettings>(key: K, value: ARGraphSettings[K]) {
    setGraphSettings((settings) => ({ ...settings, [key]: value }));
    const keyName = String(key);
    emitLearning(keyName.toLowerCase().includes("range") || keyName.toLowerCase().includes("resolution") || keyName === "samples" ? "graph_range_changed" : "graph_parameter_changed", selectedGraphId, { key: keyName, value });
  }

  function updateParameterValue(key: string, value: number) {
    setParameterValues((values) => ({ ...values, [key]: value }));
    emitLearning("graph_parameter_changed", selectedGraphId, { key, value });
  }

  function updateComparison(next: ARComparison) {
    setComparison(next);
    emitLearning("object_compared", next.objectAId ?? next.objectBId, next as unknown as Record<string, unknown>);
  }

  function updateScene(delta: Partial<ARSceneState>) {
    setSceneState((state) => ({ ...state, ...delta }));
  }

  function nudgeObject(axis: 0 | 1 | 2, amount: number) {
    setSceneState((state) => {
      const next = [...state.objectPosition] as [number, number, number];
      next[axis] = roundTo(next[axis] + amount, 2);
      return { ...state, objectPosition: next };
    });
  }

  function rotateObject(deltaY: number) {
    setSceneState((state) => ({ ...state, objectRotation: [state.objectRotation[0], roundTo(state.objectRotation[1] + deltaY, 2), state.objectRotation[2]] }));
  }

  function scaleObject(multiplier: number) {
    setSceneState((state) => ({ ...state, objectScale: Math.min(3, Math.max(0.35, roundTo(state.objectScale * multiplier, 2))) }));
  }

  return (
    <main data-testid="ar-math-lab-page" className="min-h-screen bg-[radial-gradient(circle_at_18%_5%,rgba(34,211,238,0.22),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(168,85,247,0.16),transparent_28%),linear-gradient(135deg,#ecfeff_0%,#f8fafc_52%,#f5f3ff_100%)] px-2 py-2 text-slate-950 dark:from-slate-950 dark:to-slate-900 sm:px-4 lg:px-5">
      <div className="sr-only" aria-live="polite">{sessionState.errorMessage ?? sceneMessage ?? sessionState.infoMessage}</div>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2.5 sm:gap-3">
        <header className="rounded-2xl border border-white/80 bg-white/88 p-3 shadow-lg shadow-cyan-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/88 sm:rounded-[1.5rem]">
          <div className="max-w-4xl">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300 sm:text-xs sm:tracking-[0.22em]"><ScanLine className="h-4 w-4" /> Mobile camera AR</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">AR Math Lab</h1>
            <p className="mt-1 max-w-3xl text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">Choose a function, tap AR, then move the 3D math object on the live camera.</p>
          </div>
        </header>

        <section className="grid gap-3 xl:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="order-2 min-w-0 space-y-3 xl:order-1 xl:sticky xl:top-3 xl:max-h-[calc(100dvh-1.5rem)] xl:overflow-y-auto xl:pr-1 xl:self-start">
            <ARControlPanel
              activeToolTab={activeToolTab}
              animations={animations}
              classification={classification}
              comparison={comparison}
              comparisonText={comparisonText}
              generatedSolids={generatedSolids}
              generatedGraphs={generatedGraphs}
              geometryBuilderType={geometryBuilderType}
              geometryBuilderUnit={geometryBuilderUnit}
              geometryError={geometryError}
              graphError={graphError}
              graphSettings={graphSettings}
              input={input}
              importSceneJson={importSceneJson}
              isGeneratingGraph={isGeneratingGraph}
              isGeneratingSolid={isGeneratingSolid}
              measurements={measurements}
              measurementMode={measurementMode}
              objectType={objectType}
              parameterSpecs={parameterSpecs}
              parameterValues={parameterValues}
              performanceMode={performanceMode}
              sceneState={sceneState}
              selectedSolid={selectedSolid}
              selectedSolidId={selectedSolidId}
              selectedGraphId={selectedGraphId}
              selectedExample={selectedExample}
              selectedExampleId={selectedExampleId}
              selectedLesson={selectedLesson}
              recommendations={recommendations}
              savedSceneName={savedSceneName}
              sceneMessage={sceneMessage}
              sessionState={sessionState}
              teacherMode={teacherMode}
              onAddAnimation={addAnimation}
              onAddMeasurement={addMeasurement}
              onActivate3D={activate3DPreview}
              onCaptureScene={captureScene}
              onClearMeasurements={clearMeasurements}
              onDeleteGraph={deleteSelectedGraph}
              onDeleteSolid={deleteSelectedSolid}
              onDuplicateSolid={duplicateSelectedSolid}
              onExampleChange={handleExampleChange}
              onExit={exitActiveMode}
              onGenerateGraph={generateGraph}
              onGenerateSolid={generateSolid}
              onExportSceneJson={exportSceneJson}
              onImportScene={importScene}
              onInputChange={setInput}
              onLoadScene={loadScene}
              onMove={(axis, amount) => nudgeObject(axis, amount)}
              onObjectTypeChange={setObjectType}
              onParameterChange={updateParameterValue}
              onPlaceObject={placeObject}
              onRegenerateGraph={generateGraph}
              onSaveScene={saveScene}
              onSelectSolid={selectSolid}
              onSetActiveToolTab={setActiveToolTab}
              onSetComparison={updateComparison}
              onSetGeometryBuilderType={setGeometryBuilderType}
              onSetGeometryBuilderUnit={setGeometryBuilderUnit}
              onSetImportSceneJson={setImportSceneJson}
              onSetMeasurementMode={setMeasurementMode}
              onSetPerformanceMode={(enabled) => {
                setPerformanceMode(enabled);
                if (enabled) {
                  setGraphSettings((settings) => applyPerformanceModeToGraphSettings(settings, true));
                  setSceneState((state) => ({ ...state, showLabels: false }));
                  setSessionState((state) => ({ ...state, infoMessage: "Performance Mode enabled. Mesh resolution, labels, and animation update rate are reduced." }));
                } else {
                  setSessionState((state) => ({ ...state, infoMessage: "Performance Mode disabled. You can raise quality settings manually." }));
                }
              }}
              onResetScene={resetScene}
              onResetGraphSettings={resetGraphSettings}
              onRotate={rotateObject}
              onScale={scaleObject}
              onSelectGraph={selectGraph}
              onSceneChange={updateScene}
              onSetSavedSceneName={setSavedSceneName}
              onSetTeacherMode={setTeacherMode}
              onStartAR={startARSession}
              onStartCamera={startCameraPreview}
              onUpdateAnimationStatus={updateAnimationStatus}
              onUpdateSolidCustomScale={updateSelectedSolidCustomScale}
              onUpdateSolidDimension={updateSelectedSolidDimensions}
              onUpdateSolidScale={updateSelectedSolidScale}
              onUpdateSolidSettings={updateSelectedSolidSettings}
              onUpdateGraphSetting={updateGraphSetting}
            />
          </aside>

          <div className="order-1 min-w-0 space-y-3 xl:order-2">
            <ARScene mathObject={currentObject} cameraStream={cameraStream} generatedGraphs={generatedGraphs} generatedSolids={generatedSolids} measurements={measurements} sceneState={sceneState} selectedGraph={selectedGraph} selectedSolid={selectedSolid} sessionState={sessionState} onSceneChange={updateScene} />
            <MobileQuickActions
              sessionState={sessionState}
              onActivate3D={() => activate3DPreview()}
              onGenerateGraph={generateGraph}
              onPlaceObject={placeObject}
              onStartAR={startARSession}
              onStartCamera={startCameraPreview}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export function ARScene({ mathObject, cameraStream, generatedGraphs, generatedSolids, measurements, onSceneChange, sceneState, selectedGraph, selectedSolid, sessionState }: { mathObject: ARMathObject; cameraStream: MediaStream | null; generatedGraphs: ARGeneratedGraphObject[]; generatedSolids: ARGeneratedGeometrySolid[]; measurements: ARMeasurement[]; onSceneChange: (delta: Partial<ARSceneState>) => void; sceneState: ARSceneState; selectedGraph?: ARGeneratedGraphObject; selectedSolid?: ARGeneratedGeometrySolid; sessionState: ARSessionState }) {
  const mode = sessionState.mode === "none" ? "3d-preview" : sessionState.mode;
  return (
    <section data-testid="ar-scene" className="relative overflow-hidden rounded-[1.5rem] border border-cyan-200/80 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 sm:rounded-[2rem]">
      {mode === "camera-preview" ? <ARCameraPreview mathObject={mathObject} mode="camera-preview" onSceneChange={onSceneChange} sceneState={sceneState} selectedGraph={selectedGraph} selectedSolid={selectedSolid} stream={cameraStream} /> : null}
      {mode === "ar" ? <ARCameraPreview mathObject={mathObject} mode="ar" onSceneChange={onSceneChange} sceneState={sceneState} selectedGraph={selectedGraph} selectedSolid={selectedSolid} stream={cameraStream} /> : null}
      {mode === "3d-preview" ? <ARFallbackViewer generatedGraphs={generatedGraphs} generatedSolids={generatedSolids} measurements={measurements} mathObject={mathObject} sceneState={sceneState} /> : null}
    </section>
  );
}

export function ARCameraPreview({ mathObject, mode, onSceneChange, sceneState, selectedGraph, selectedSolid, stream }: { mathObject: ARMathObject; mode: "ar" | "camera-preview"; onSceneChange: (delta: Partial<ARSceneState>) => void; sceneState: ARSceneState; selectedGraph?: ARGeneratedGraphObject; selectedSolid?: ARGeneratedGeometrySolid; stream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activePointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{ distance: number; angle: number } | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.srcObject = stream;
    return () => {
      video.pause();
      video.srcObject = null;
    };
  }, [stream]);

  function placeFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = roundTo((event.clientX - (rect.left + rect.width / 2)) / 44, 2);
    const y = roundTo(-(event.clientY - (rect.top + rect.height / 2)) / 36, 2);
    onSceneChange({ objectPosition: [Math.max(-4, Math.min(4, x)), Math.max(-4, Math.min(4, y)), sceneState.objectPosition[2]], placementReady: true });
  }

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
  }

  function handleGesture(event: PointerEvent<HTMLDivElement>) {
    updatePointer(event);
    const pointers = [...activePointersRef.current.values()];
    if (pointers.length < 2) {
      gestureRef.current = null;
      placeFromPointer(event);
      return;
    }

    const [a, b] = pointers;
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const previous = gestureRef.current;
    gestureRef.current = { distance, angle };
    if (!previous) return;

    const scaleMultiplier = Math.max(0.82, Math.min(1.18, distance / Math.max(1, previous.distance)));
    const nextScale = Math.min(3, Math.max(0.35, roundTo(sceneState.objectScale * scaleMultiplier, 2)));
    const nextRotationY = roundTo(sceneState.objectRotation[1] + angle - previous.angle, 2);
    onSceneChange({ objectScale: nextScale, objectRotation: [sceneState.objectRotation[0], nextRotationY, sceneState.objectRotation[2]], placementReady: true });
  }

  return (
    <div
      ref={stageRef}
      className="relative h-[clamp(300px,52dvh,540px)] min-h-[300px] touch-none overflow-hidden bg-black xl:h-[clamp(440px,calc(100dvh-170px),720px)]"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePointer(event);
        if (activePointersRef.current.size === 1) placeFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (!activePointersRef.current.has(event.pointerId)) return;
        handleGesture(event);
      }}
      onPointerUp={(event) => {
        activePointersRef.current.delete(event.pointerId);
        if (activePointersRef.current.size < 2) gestureRef.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        activePointersRef.current.delete(event.pointerId);
        if (activePointersRef.current.size < 2) gestureRef.current = null;
      }}
    >
      {stream ? <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline aria-label="Live camera preview" /> : <div className="grid h-full place-items-center text-center text-sm font-bold text-slate-300">Waiting for camera permission...</div>}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_36%,rgba(2,6,23,0.34)_72%)]" />
      <ARPlacementMarker mode={mode} sceneState={sceneState} />
      <ARLiveCamera3DOverlay mathObject={mathObject} sceneState={sceneState} selectedGraph={selectedGraph} selectedSolid={selectedSolid} />
      <OverlayLabel mathObject={mathObject} sceneState={sceneState} selectedGraph={selectedGraph} selectedSolid={selectedSolid} />
      <p className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-xl bg-black/55 px-3 py-2 text-center text-xs font-black text-white backdrop-blur sm:bottom-3 sm:left-3 sm:right-3">Drag to move. Pinch to scale/rotate.</p>
    </div>
  );
}

function ARLiveCamera3DOverlay({ mathObject, sceneState, selectedGraph, selectedSolid }: { mathObject: ARMathObject; sceneState: ARSceneState; selectedGraph?: ARGeneratedGraphObject; selectedSolid?: ARGeneratedGeometrySolid }) {
  const overlaySceneState: ARSceneState = {
    ...sceneState,
    objectPosition: [sceneState.objectPosition[0] * 0.14, sceneState.objectPosition[1] * 0.11, 0],
    objectScale: sceneState.objectScale * 0.52,
  };

  return (
    <div className="pointer-events-none absolute inset-0" data-testid="browser-ar-three-overlay">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 6], zoom: 110, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#e0f2fe", "#0f172a", 0.88]} />
        <directionalLight position={[3, 4, 5]} intensity={1.25} />
        <pointLight position={[-2, 1.4, 2]} intensity={0.75} color="#22d3ee" />
        {selectedSolid ? <ARGeometrySolid sceneState={overlaySceneState} solid={selectedSolid} /> : null}
        {selectedGraph ? <ARGraphObject graph={selectedGraph} sceneState={overlaySceneState} /> : null}
        {!selectedSolid && !selectedGraph ? <CameraOverlayPlaceholder mathObject={mathObject} sceneState={overlaySceneState} /> : null}
      </Canvas>
    </div>
  );
}

function CameraOverlayPlaceholder({ mathObject, sceneState }: { mathObject: ARMathObject; sceneState: ARSceneState }) {
  return (
    <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.52} roughness={0.34} metalness={0.12} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.82, 0.025, 12, 64]} />
        <meshStandardMaterial color="#c084fc" emissive="#7c3aed" emissiveIntensity={0.28} />
      </mesh>
      {sceneState.showLabels ? (
        <Text position={[0, 0.9, 0]} fontSize={0.15} color="#e0f2fe" anchorX="center" outlineWidth={0.004} outlineColor="#020617">
          {objectTypeLabels[mathObject.type]}
        </Text>
      ) : null}
    </group>
  );
}

export function ARFallbackViewer({ generatedGraphs, generatedSolids, measurements, mathObject, sceneState }: { generatedGraphs: ARGeneratedGraphObject[]; generatedSolids: ARGeneratedGeometrySolid[]; measurements: ARMeasurement[]; mathObject: ARMathObject; sceneState: ARSceneState }) {
  return (
    <div data-testid="ar-fallback-viewer" className="p-3 sm:p-4">
      <ThreeSceneWrapper height="clamp(440px, calc(100dvh - 170px), 720px)" mobileHeight="clamp(300px, 52dvh, 540px)" cameraPosition={[5, 4, 7]} fov={45} quality="high" chrome="cinematic" sceneLabel="3D Preview Mode" interactionLabel="Drag rotate - pinch or wheel zoom - right drag pan">
        <PreviewScene generatedGraphs={generatedGraphs} generatedSolids={generatedSolids} measurements={measurements} mathObject={mathObject} sceneState={sceneState} />
        <OrbitControls enablePan enableZoom enableDamping dampingFactor={0.08} />
      </ThreeSceneWrapper>
    </div>
  );
}

function PreviewScene({ generatedGraphs, generatedSolids, measurements, mathObject, sceneState }: { generatedGraphs: ARGeneratedGraphObject[]; generatedSolids: ARGeneratedGeometrySolid[]; measurements: ARMeasurement[]; mathObject: ARMathObject; sceneState: ARSceneState }) {
  const visibleGraphs = generatedGraphs.filter((graph) => graph.visible);
  const visibleSolids = generatedSolids.filter((solid) => solid.visible);
  return (
    <group>
      {sceneState.showGrid ? <gridHelper args={[8, 16, "#22d3ee", "#334155"]} /> : null}
      {sceneState.showAxes ? <axesHelper args={[3.5]} /> : null}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.55} />
      </mesh>
      <ARPlacementMarker3D sceneState={sceneState} />
      {!visibleGraphs.length && !visibleSolids.length ? (
        <Text position={[0, 1.45, 0]} fontSize={0.13} color="#e0f2fe" anchorX="center" maxWidth={3.4}>
          Create a graph or geometry object to begin.
        </Text>
      ) : null}
      {visibleSolids.map((solid) => <ARGeometrySolid key={solid.id} sceneState={sceneState} solid={solid} />)}
      {measurements.filter((measurement) => measurement.visible).map((measurement) => <ARMeasurementLine key={measurement.id} measurement={measurement} sceneState={sceneState} />)}
      {visibleGraphs.length || visibleSolids.length ? visibleGraphs.map((graph) => <ARGraphObject key={graph.id} graph={graph} sceneState={sceneState} />) : (
      <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#22d3ee" transparent opacity={0.42} roughness={0.35} metalness={0.12} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.82, 0.025, 12, 64]} />
          <meshStandardMaterial color="#c084fc" emissive="#7c3aed" emissiveIntensity={0.28} />
        </mesh>
        {sceneState.showLabels ? (
          <Text position={[0, 0.9, 0]} fontSize={0.18} color="#e0f2fe" anchorX="center" anchorY="middle">
            {objectTypeLabels[mathObject.type]}
          </Text>
        ) : null}
      </group>
      )}
      {sceneState.showLabels ? (
        <>
          <Text position={[3.8, 0.12, 0]} fontSize={0.16} color="#67e8f9">x</Text>
          <Text position={[0, 3.55, 0]} fontSize={0.16} color="#bbf7d0">y</Text>
          <Text position={[0, 0.12, 3.8]} fontSize={0.16} color="#fda4af">z</Text>
        </>
      ) : null}
    </group>
  );
}

function ARPlacementMarker3D({ sceneState }: { sceneState: ARSceneState }) {
  return (
    <group position={[0, 0.04, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.5, 64]} />
        <meshStandardMaterial color={sceneState.placementReady ? "#facc15" : "#22d3ee"} emissive={sceneState.placementReady ? "#facc15" : "#22d3ee"} emissiveIntensity={0.35} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function ARGeometrySolid({ sceneState, solid }: { sceneState: ARSceneState; solid: ARGeneratedGeometrySolid }) {
  const displayScale = calculateDisplayScale(solid);
  return (
    <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
      <group position={solid.transform.position} rotation={solid.transform.rotation} scale={[displayScale * solid.transform.scale[0], displayScale * solid.transform.scale[1], displayScale * solid.transform.scale[2]]}>
        <ARGeometryMesh solid={solid} />
        {solid.settings.showWireframe ? <ARWireframeOverlay solid={solid} /> : null}
        {solid.settings.showDimensionLines ? <ARDimensionLines solid={solid} /> : null}
        {sceneState.showLabels && solid.settings.showLabels ? <ARDimensionLabels solid={solid} /> : null}
        {solid.settings.showCrossSection && solid.settings.crossSectionMode !== "off" ? <ARCrossSectionTool solid={solid} /> : null}
      </group>
    </group>
  );
}

function ARGeometryMesh({ solid }: { solid: ARGeneratedGeometrySolid }) {
  const d = solid.dimensions;
  const color = solid.solidType === "cone" || solid.solidType === "frustum" || solid.solidType === "pyramid" ? "#fb7185" : solid.solidType === "sphere" || solid.solidType === "hemisphere" || solid.solidType === "torus" ? "#a78bfa" : "#22d3ee";
  const material = <meshStandardMaterial color={color} transparent={solid.settings.transparent} opacity={solid.settings.transparent ? 0.58 : 0.95} roughness={0.35} metalness={0.08} side={THREE.DoubleSide} />;
  const segments = qualitySegments(solid.settings.quality);

  if (solid.solidType === "cube") {
    const s = d.side.meters;
    return <mesh castShadow position={[0, s / 2, 0]}><boxGeometry args={[s, s, s]} />{material}</mesh>;
  }
  if (solid.solidType === "cuboid") {
    return <mesh castShadow position={[0, d.height.meters / 2, 0]}><boxGeometry args={[d.length.meters, d.height.meters, d.width.meters]} />{material}</mesh>;
  }
  if (solid.solidType === "cylinder") {
    return <mesh castShadow position={[0, d.height.meters / 2, 0]}><cylinderGeometry args={[d.radius.meters, d.radius.meters, d.height.meters, segments.radial, 1, false]} />{material}</mesh>;
  }
  if (solid.solidType === "cone") {
    return <mesh castShadow position={[0, d.height.meters / 2, 0]}><coneGeometry args={[d.radius.meters, d.height.meters, segments.radial, 1, false]} />{material}</mesh>;
  }
  if (solid.solidType === "sphere") {
    return <mesh castShadow position={[0, d.radius.meters, 0]}><sphereGeometry args={[d.radius.meters, segments.sphereWidth, segments.sphereHeight]} />{material}</mesh>;
  }
  if (solid.solidType === "hemisphere") {
    return <mesh castShadow position={[0, 0, 0]}><sphereGeometry args={[d.radius.meters, segments.sphereWidth, segments.sphereHeight, 0, Math.PI * 2, 0, Math.PI / 2]} />{material}</mesh>;
  }
  if (solid.solidType === "frustum") {
    return <mesh castShadow position={[0, d.height.meters / 2, 0]}><cylinderGeometry args={[d.topRadius.meters, d.bottomRadius.meters, d.height.meters, segments.radial, 1, false]} />{material}</mesh>;
  }
  if (solid.solidType === "torus") {
    return <mesh castShadow position={[0, d.minorRadius.meters + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[d.majorRadius.meters, d.minorRadius.meters, segments.torusTube, segments.radial]} />{material}</mesh>;
  }
  if (solid.solidType === "pyramid") {
    const geometry = new THREE.ConeGeometry(d.baseSide.meters / Math.sqrt(2), d.height.meters, 4);
    return <mesh castShadow position={[0, d.height.meters / 2, 0]} rotation={[0, Math.PI / 4, 0]}><primitive object={geometry} />{material}</mesh>;
  }
  const sides = Math.max(3, Math.round(d.baseType?.value ?? 6));
  return <mesh castShadow position={[0, d.height.meters / 2, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[d.baseSide.meters, d.baseSide.meters, d.height.meters, sides, 1, false]} />{material}</mesh>;
}

function ARWireframeOverlay({ solid }: { solid: ARGeneratedGeometrySolid }) {
  return (
    <group>
      <Text position={[0, -0.08, 0]} fontSize={0.04} color="#e0f2fe" anchorX="center">{solid.name} wireframe on</Text>
    </group>
  );
}

function ARDimensionLines({ solid }: { solid: ARGeneratedGeometrySolid }) {
  const d = solid.dimensions;
  const radius = d.radius?.meters ?? d.bottomRadius?.meters ?? d.majorRadius?.meters ?? d.side?.meters ?? d.baseSide?.meters ?? 0.2;
  const height = d.height?.meters ?? d.side?.meters ?? (d.radius ? d.radius.meters * 2 : undefined) ?? 0.2;
  const lineColor = "#facc15";
  return (
    <group>
      <Line points={[[radius, 0, 0], [radius, height, 0]]} color={lineColor} lineWidth={2} />
      <Line points={[[0, 0.02, 0], [radius, 0.02, 0]]} color="#67e8f9" lineWidth={2} />
      {(solid.solidType === "cone" || solid.solidType === "pyramid" || solid.solidType === "frustum") ? <Line points={[[-radius, 0, 0], [0, height, 0]]} color="#fb7185" lineWidth={2} /> : null}
    </group>
  );
}

function ARDimensionLabels({ solid }: { solid: ARGeneratedGeometrySolid }) {
  const d = solid.dimensions;
  const radius = d.radius?.meters ?? d.bottomRadius?.meters ?? d.majorRadius?.meters ?? d.side?.meters ?? d.baseSide?.meters ?? 0.2;
  const height = d.height?.meters ?? d.side?.meters ?? (d.radius ? d.radius.meters * 2 : undefined) ?? 0.2;
  const labels = dimensionLabelEntries(solid);
  return (
    <group>
      {labels.slice(0, 5).map((label, index) => (
        <Text key={label} position={[index % 2 === 0 ? -radius * 1.2 : radius * 1.2, height * (0.25 + index * 0.16), 0]} fontSize={0.045} color="#e0f2fe" anchorX="center" anchorY="middle" outlineWidth={0.003} outlineColor="#020617">
          {label}
        </Text>
      ))}
    </group>
  );
}

function ARCrossSectionTool({ solid }: { solid: ARGeneratedGeometrySolid }) {
  const d = solid.dimensions;
  const radius = d.radius?.meters ?? d.bottomRadius?.meters ?? d.side?.meters ?? d.baseSide?.meters ?? 0.2;
  const height = d.height?.meters ?? d.side?.meters ?? (d.radius ? d.radius.meters * 2 : undefined) ?? 0.2;
  const horizontal = solid.settings.crossSectionMode === "horizontal";
  return (
    <group>
      <mesh position={[0, horizontal ? height * solid.settings.crossSectionPosition : height / 2, 0]} rotation={horizontal ? [-Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0]}>
        <circleGeometry args={[radius * 1.04, 48]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.24} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, height + 0.12, 0]} fontSize={0.045} color="#fde68a" anchorX="center" maxWidth={1.2}>
        {crossSectionLabel(solid.solidType, solid.settings.crossSectionMode)}
      </Text>
    </group>
  );
}

function ARMeasurementLine({ measurement, sceneState }: { measurement: ARMeasurement; sceneState: ARSceneState }) {
  if (!measurement.points.length) {
    return (
      <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
        <Text position={[0, 0.35, 0]} fontSize={0.06} color="#fde68a" anchorX="center" outlineWidth={0.003} outlineColor="#020617">
          {measurement.label}
        </Text>
      </group>
    );
  }

  const [a, b, c] = measurement.points;
  const end = b ?? a;
  const labelPosition = b ? midpoint(a, b) : a;
  return (
    <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
      {b ? <Line points={[a, b]} color="#facc15" lineWidth={2} /> : null}
      {measurement.type === "angle" && c ? <Line points={[b, c]} color="#facc15" lineWidth={2} /> : null}
      <mesh position={a}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.45} />
      </mesh>
      {b ? (
        <mesh position={end}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.45} />
        </mesh>
      ) : null}
      <Text position={[labelPosition[0], labelPosition[1] + 0.12, labelPosition[2]]} fontSize={0.06} color="#fde68a" anchorX="center" outlineWidth={0.003} outlineColor="#020617">
        {measurement.label}
      </Text>
    </group>
  );
}

function dimensionLabelEntries(solid: ARGeneratedGeometrySolid) {
  const unit = solid.unit;
  const dimensions = Object.entries(solid.dimensions).filter(([key]) => key !== "baseType").map(([key, dimension]) => `${readableDimensionName(key)} = ${formatNumber(dimension.value)} ${unit}`);
  const formula = solid.calculatedValues.formulas[0]?.result ? [solid.calculatedValues.formulas[0].result] : [];
  return [...dimensions, ...formula];
}

function midpoint(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

export function ARGraphObject({ graph, sceneState }: { graph: ARGeneratedGraphObject; sceneState: ARSceneState }) {
  const transform = graph.transform;
  return (
    <group position={sceneState.objectPosition} rotation={sceneState.objectRotation} scale={sceneState.objectScale}>
      <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
        {graph.geometry.kind === "surface" ? <ARMathSurface graph={graph} sceneState={sceneState} /> : <ARParametricCurve graph={graph} sceneState={sceneState} />}
        {sceneState.showLabels ? (
          <Text position={[0, 2.4, 0]} fontSize={0.16} color="#e0f2fe" anchorX="center" anchorY="middle" maxWidth={4}>
            {graph.equation}
          </Text>
        ) : null}
      </group>
    </group>
  );
}

export function ARMathSurface({ graph, sceneState }: { graph: ARGeneratedGraphObject; sceneState: ARSceneState }) {
  if (graph.geometry.kind !== "surface") return null;
  const geometry = graph.geometry;
  return (
    <group>
      <mesh>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(geometry.vertices), 3]} />
          {geometry.colors ? <bufferAttribute attach="attributes-color" args={[new Float32Array(geometry.colors), 3]} /> : null}
          <bufferAttribute attach="index" args={[new Uint32Array(geometry.indices), 1]} />
        </bufferGeometry>
        <meshStandardMaterial
          color={geometry.colors ? undefined : "#22d3ee"}
          vertexColors={Boolean(geometry.colors)}
          side={THREE.DoubleSide}
          transparent={graph.settings.transparent}
          opacity={graph.settings.transparent ? 0.72 : 1}
          roughness={0.34}
          metalness={0.08}
        />
      </mesh>
      {(graph.settings.wireframe || graph.settings.surfaceStyle === "wireframe" || graph.settings.surfaceStyle === "solid-wireframe") && (
        <mesh>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(geometry.vertices), 3]} />
            <bufferAttribute attach="index" args={[new Uint32Array(geometry.indices), 1]} />
          </bufferGeometry>
          <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      )}
      {sceneState.showLabels ? <Text position={[0, -0.35, 0]} fontSize={0.13} color="#bae6fd">surface mesh</Text> : null}
    </group>
  );
}

export function ARParametricCurve({ graph, sceneState }: { graph: ARGeneratedGraphObject; sceneState: ARSceneState }) {
  if (graph.geometry.kind !== "curve") return null;
  const geometry = graph.geometry;
  return (
    <group>
      <Line points={geometry.points} color="#22d3ee" lineWidth={Math.max(1, graph.settings.curveThickness * 80)} />
      {(graph.settings.pointMarkers || graph.settings.curveStyle === "line-points") ? geometry.points.filter((_, index) => index % Math.max(1, Math.floor(geometry.points.length / 64)) === 0).map((point, index) => (
        <mesh key={`${point.join("-")}-${index}`} position={point}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.25} />
        </mesh>
      )) : null}
      {sceneState.showLabels ? <Text position={[0, -0.35, 0]} fontSize={0.13} color="#bae6fd">parametric curve</Text> : null}
    </group>
  );
}

export function ARPlacementMarker({ mode, sceneState }: { mode: "ar" | "camera-preview"; sceneState: ARSceneState }) {
  const colorClass = sceneState.placementReady ? "border-yellow-300 bg-yellow-300/15 shadow-yellow-300/40" : "border-cyan-200 bg-cyan-200/10 shadow-cyan-300/30";
  return (
    <div className={`pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${colorClass} shadow-2xl`}>
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/55" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/55" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-3 py-1 text-[11px] font-black text-white">{mode === "ar" ? "AR reticle" : "Overlay marker"}</span>
    </div>
  );
}

function OverlayLabel({ mathObject, sceneState, selectedGraph, selectedSolid }: { mathObject: ARMathObject; sceneState: ARSceneState; selectedGraph?: ARGeneratedGraphObject; selectedSolid?: ARGeneratedGeometrySolid }) {
  const [x, y] = sceneState.objectPosition;
  const transform = `translate(-50%, -50%) translate(${x * 44}px, ${-y * 36}px) rotate(${sceneState.objectRotation[1]}rad) scale(${sceneState.objectScale})`;
  const label = selectedSolid?.name ?? selectedGraph?.name ?? objectTypeLabels[mathObject.type];
  const detail = selectedSolid ? formulaSummaryForOverlay(selectedSolid) : selectedGraph?.equation;
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(46vw,360px)] max-w-[360px] text-center" style={{ transform }}>
      {sceneState.showLabels ? (
        <div className="mx-auto mt-[min(28vw,190px)] max-w-[320px] rounded-2xl bg-black/55 px-3 py-2 text-white backdrop-blur">
          <p className="line-clamp-1 text-xs font-black">{label}</p>
          {detail ? <p className="line-clamp-1 text-[10px] font-bold text-cyan-50">{detail}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function ARStatusPanel({ sessionState, support }: { sessionState: ARSessionState; support: ARSupportStatus }) {
  const messages = [sessionState.errorMessage, sessionState.infoMessage, ...support.warnings].filter(Boolean) as string[];
  return (
    <SectionCard title="AR Status" description="Live camera, browser AR, and fallback status." compact>
      <div data-testid="ar-status-panel" className="grid grid-cols-2 gap-2">
        <StatusBadge label="mode" value={sessionState.mode} tone={sessionState.status === "active" ? "ready" : "idle"} />
        <StatusBadge label="status" value={sessionState.status} tone={sessionState.status === "active" || sessionState.status === "ready" ? "ready" : "idle"} />
        <StatusBadge label="browser AR" value={support.cameraAvailable ? "ready" : "fallback"} tone={support.cameraAvailable ? "ready" : "idle"} />
        <StatusBadge label="camera permission" value={sessionState.cameraPermission} tone={sessionState.cameraPermission === "granted" ? "ready" : "idle"} />
        <StatusBadge label="secure" value={support.isSecureContext ? "yes" : "no"} tone={support.isSecureContext ? "ready" : "idle"} />
        <StatusBadge label="WebGL" value={support.webGLAvailable ? "yes" : "no"} tone={support.webGLAvailable ? "ready" : "idle"} />
      </div>
      <ul className="mt-3 space-y-2 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
        {messages.map((note) => <li key={note} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />{note}</li>)}
      </ul>
    </SectionCard>
  );
}

function MobileQuickActions({ sessionState, onActivate3D, onGenerateGraph, onPlaceObject, onStartAR, onStartCamera }: {
  sessionState: ARSessionState;
  onActivate3D: () => void;
  onGenerateGraph: () => void;
  onPlaceObject: () => void;
  onStartAR: () => void;
  onStartCamera: () => void;
}) {
  return (
    <section className="sticky top-1 z-30 rounded-[1.35rem] border border-cyan-200/80 bg-white/92 p-2 shadow-xl shadow-cyan-950/10 backdrop-blur xl:hidden">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">AR controls</p>
          <p className="truncate text-[11px] font-bold text-slate-500">Camera, function, place.</p>
        </div>
        {sessionState.status === "starting" ? <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800">opening</span> : null}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        <MobileActionButton label="AR" icon={<ScanLine className="h-4 w-4" />} onClick={onStartAR} primary />
        <MobileActionButton label="Camera" icon={<Camera className="h-4 w-4" />} onClick={onStartCamera} />
        <MobileActionButton label="3D" icon={<Cuboid className="h-4 w-4" />} onClick={onActivate3D} />
        <MobileActionButton label="Graph" icon={<Sparkles className="h-4 w-4" />} onClick={onGenerateGraph} primary />
        <MobileActionButton label="Place" icon={<Move3D className="h-4 w-4" />} onClick={onPlaceObject} primary />
      </div>
    </section>
  );
}

function MobileActionButton({ icon, label, onClick, primary = false }: { icon: ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      className={`${primary ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20" : "bg-slate-50 text-slate-800 ring-1 ring-slate-200"} flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-black active:scale-[0.98]`}
      type="button"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function ARControlPanel(props: {
  activeToolTab: ARAdvancedToolTab;
  animations: ARAnimation[];
  classification: EquationClassificationResult;
  comparison: ARComparison;
  comparisonText: string;
  generatedSolids: ARGeneratedGeometrySolid[];
  generatedGraphs: ARGeneratedGraphObject[];
  geometryBuilderType: ARSolidType;
  geometryBuilderUnit: ARUnit;
  geometryError: string;
  graphError: string;
  graphSettings: ARGraphSettings;
  input: string;
  importSceneJson: string;
  isGeneratingGraph: boolean;
  isGeneratingSolid: boolean;
  measurements: ARMeasurement[];
  measurementMode: ARMeasurementType | "off";
  objectType: ARObjectType;
  parameterSpecs: ReturnType<typeof parameterSliderSpecs>;
  parameterValues: Record<string, number>;
  performanceMode: boolean;
  sceneState: ARSceneState;
  selectedGraphId?: string;
  selectedExample: ARExample;
  selectedExampleId: string;
  selectedLesson: ReturnType<typeof lessonFor>;
  selectedSolid?: ARGeneratedGeometrySolid;
  selectedSolidId?: string;
  recommendations: string[];
  savedSceneName: string;
  sceneMessage: string;
  sessionState: ARSessionState;
  teacherMode: boolean;
  onAddAnimation: (target?: ARAnimation["target"]) => void;
  onAddMeasurement: (type?: ARMeasurementType) => void;
  onActivate3D: () => void;
  onCaptureScene: () => void;
  onClearMeasurements: () => void;
  onDeleteGraph: () => void;
  onDeleteSolid: () => void;
  onDuplicateSolid: () => void;
  onExampleChange: (exampleId: string) => void;
  onExit: () => void;
  onGenerateGraph: () => void;
  onGenerateSolid: () => void;
  onExportSceneJson: () => void;
  onImportScene: () => void;
  onInputChange: (input: string) => void;
  onLoadScene: () => void;
  onMove: (axis: 0 | 1 | 2, amount: number) => void;
  onObjectTypeChange: (objectType: ARObjectType) => void;
  onParameterChange: (key: string, value: number) => void;
  onPlaceObject: () => void;
  onRegenerateGraph: () => void;
  onSaveScene: () => void;
  onResetGraphSettings: () => void;
  onResetScene: () => void;
  onRotate: (deltaY: number) => void;
  onScale: (multiplier: number) => void;
  onSelectGraph: (id: string | undefined) => void;
  onSelectSolid: (id: string | undefined) => void;
  onSceneChange: (delta: Partial<ARSceneState>) => void;
  onSetActiveToolTab: (tab: ARAdvancedToolTab) => void;
  onSetComparison: (comparison: ARComparison) => void;
  onSetGeometryBuilderType: (type: ARSolidType) => void;
  onSetGeometryBuilderUnit: (unit: ARUnit) => void;
  onSetImportSceneJson: (value: string) => void;
  onSetMeasurementMode: (mode: ARMeasurementType | "off") => void;
  onSetPerformanceMode: (enabled: boolean) => void;
  onSetSavedSceneName: (value: string) => void;
  onSetTeacherMode: (enabled: boolean) => void;
  onStartAR: () => void;
  onStartCamera: () => void;
  onUpdateAnimationStatus: (id: string, status: ARAnimation["status"]) => void;
  onUpdateSolidCustomScale: (value: number) => void;
  onUpdateSolidDimension: (key: string, value: number) => void;
  onUpdateSolidScale: (mode: ARScaleMode) => void;
  onUpdateSolidSettings: (delta: Partial<ARGeneratedGeometrySolid["settings"]>) => void;
  onUpdateGraphSetting: <K extends keyof ARGraphSettings>(key: K, value: ARGraphSettings[K]) => void;
}) {
  const { activeToolTab, animations, classification, comparison, comparisonText, generatedGraphs, generatedSolids, geometryBuilderType, geometryBuilderUnit, geometryError, graphError, graphSettings, importSceneJson, input, isGeneratingGraph, isGeneratingSolid, measurements, measurementMode, objectType, parameterSpecs, parameterValues, performanceMode, recommendations, savedSceneName, sceneMessage, sceneState, selectedExample, selectedExampleId, selectedGraphId, selectedLesson, selectedSolid, selectedSolidId, sessionState, teacherMode } = props;
  return (
    <SectionCard title="Controls" description="Generate equation graphs, tune ranges, and place the object in AR, camera, or 3D preview." compact>
      <div data-testid="ar-control-panel" className="space-y-4">
        <div className="hidden grid-cols-2 gap-2 xl:grid">
          <ControlButton label="Start AR" icon={<ScanLine className="h-4 w-4" />} onClick={props.onStartAR} primary disabled={sessionState.status === "starting"} />
          <ControlButton label="Camera" icon={<Camera className="h-4 w-4" />} onClick={props.onStartCamera} />
          <ControlButton label="3D Preview" icon={<Cuboid className="h-4 w-4" />} onClick={() => props.onActivate3D()} />
          <ControlButton label="Exit" icon={<X className="h-4 w-4" />} onClick={props.onExit} />
          <ControlButton label="Reset Scene" icon={<RotateCcw className="h-4 w-4" />} onClick={props.onResetScene} />
          <ControlButton label="Place Object" icon={<Move3D className="h-4 w-4" />} onClick={props.onPlaceObject} primary />
        </div>

        <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
          Example library
          <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" value={selectedExampleId} onChange={(event) => props.onExampleChange(event.target.value)}>
            {arExampleGroups.map((group) => (
              <optgroup key={group} label={group}>
                {arMathExamples.filter((example) => example.group === group).map((example) => <option key={example.id} value={example.id}>{example.title}</option>)}
              </optgroup>
            ))}
          </select>
        </label>

        <SmartMathInput ariaLabel="AR Math Lab equation input" className="ar-equation-input" compact mode="workspace" onChange={props.onInputChange} placeholder="z = sin(x) * sin(y)" rows={3} showLegend={false} value={input} />

        <div className="grid grid-cols-2 gap-2">
          <ControlButton label={isGeneratingGraph ? "Generating..." : "Generate Graph"} icon={<Sparkles className="h-4 w-4" />} onClick={props.onGenerateGraph} primary disabled={isGeneratingGraph} />
          <ControlButton label={isGeneratingSolid ? "Generating..." : "Generate Solid"} icon={<Cuboid className="h-4 w-4" />} onClick={props.onGenerateSolid} primary disabled={isGeneratingSolid} />
          <ControlButton label="Regenerate" icon={<RotateCcw className="h-4 w-4" />} onClick={props.onRegenerateGraph} />
          <ControlButton label="Reset Settings" icon={<RotateCcwSquare className="h-4 w-4" />} onClick={props.onResetGraphSettings} />
          <ControlButton label="Delete Graph" icon={<X className="h-4 w-4" />} onClick={props.onDeleteGraph} />
          <ControlButton label="Delete Solid" icon={<X className="h-4 w-4" />} onClick={props.onDeleteSolid} />
        </div>

        {graphError ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100">{graphError}</p> : null}
        {geometryError ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">{geometryError}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
            Object selector
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" value={objectType} onChange={(event) => props.onObjectTypeChange(event.target.value as ARObjectType)}>
              {Object.entries(objectTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-3 text-sm dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <p className="font-black text-cyan-900 dark:text-cyan-100">Classification: {objectTypeLabels[classification.type]}</p>
            <p className="mt-1 font-semibold leading-5 text-slate-600 dark:text-slate-300">{classification.message}</p>
          </div>
        </div>

        <details className="ar-mobile-disclosure">
          <summary>More controls, formulas, and measurements</summary>
          <div className="ar-mobile-disclosure-body space-y-4">
            <GraphSettingsPanel classification={classification} graphSettings={graphSettings} onChange={props.onUpdateGraphSetting} />
            <ARGeometryBuilder
              builderType={geometryBuilderType}
              builderUnit={geometryBuilderUnit}
              selectedSolid={selectedSolid}
              onDuplicate={props.onDuplicateSolid}
              onGenerateSolid={props.onGenerateSolid}
              onSetBuilderType={props.onSetGeometryBuilderType}
              onSetBuilderUnit={props.onSetGeometryBuilderUnit}
              onUpdateCustomScale={props.onUpdateSolidCustomScale}
              onUpdateDimension={props.onUpdateSolidDimension}
              onUpdateScale={props.onUpdateSolidScale}
              onUpdateSettings={props.onUpdateSolidSettings}
            />

            {parameterSpecs.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
                <p className="text-sm font-black">Parameter sliders</p>
                <div className="mt-3 space-y-3">
                  {parameterSpecs.map((spec) => (
                    <label key={spec.key} className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {spec.key} = {parameterValues[spec.key] ?? spec.defaultValue}
                      <input
                        className="mt-2 w-full accent-cyan-500"
                        type="range"
                        min={spec.min}
                        max={spec.max}
                        step={spec.step}
                        value={parameterValues[spec.key] ?? spec.defaultValue}
                        onChange={(event) => props.onParameterChange(spec.key, Number(event.target.value))}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <ObjectListPanel graphs={generatedGraphs} selectedGraphId={selectedGraphId} onSelectGraph={props.onSelectGraph} />
            <GeometryObjectListPanel solids={generatedSolids} selectedSolidId={selectedSolidId} onSelectSolid={props.onSelectSolid} />

            <div className="grid grid-cols-3 gap-2">
              <ToggleButton label="Grid" checked={sceneState.showGrid} onClick={() => props.onSceneChange({ showGrid: !sceneState.showGrid })} />
              <ToggleButton label="Axes" checked={sceneState.showAxes} onClick={() => props.onSceneChange({ showAxes: !sceneState.showAxes })} />
              <ToggleButton label="Labels" checked={sceneState.showLabels} onClick={() => props.onSceneChange({ showLabels: !sceneState.showLabels })} />
            </div>
            <CheckToggle label="Performance Mode" checked={performanceMode} onChange={props.onSetPerformanceMode} />

            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
              <p className="text-sm font-black">Object controls</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <ControlButton label="Scale +" icon={<Plus className="h-4 w-4" />} onClick={() => props.onScale(1.15)} />
                <ControlButton label="Move Up" icon={<Move3D className="h-4 w-4" />} onClick={() => props.onMove(1, 0.15)} />
                <ControlButton label="Rotate R" icon={<RotateCwSquare className="h-4 w-4" />} onClick={() => props.onRotate(0.18)} />
                <ControlButton label="Move Left" icon={<Minus className="h-4 w-4" />} onClick={() => props.onMove(0, -0.15)} />
                <ControlButton label="Center" icon={<Compass className="h-4 w-4" />} onClick={() => props.onSceneChange({ objectPosition: [0, 0.45, 0] })} />
                <ControlButton label="Move Right" icon={<Plus className="h-4 w-4" />} onClick={() => props.onMove(0, 0.15)} />
                <ControlButton label="Scale -" icon={<Minus className="h-4 w-4" />} onClick={() => props.onScale(0.87)} />
                <ControlButton label="Move Down" icon={<Move3D className="h-4 w-4" />} onClick={() => props.onMove(1, -0.15)} />
                <ControlButton label="Rotate L" icon={<RotateCcwSquare className="h-4 w-4" />} onClick={() => props.onRotate(-0.18)} />
              </div>
            </div>

            <ARAdvancedToolsPanel
              activeToolTab={activeToolTab}
              animations={animations}
              comparison={comparison}
              comparisonText={comparisonText}
              generatedGraphs={generatedGraphs}
              generatedSolids={generatedSolids}
              importSceneJson={importSceneJson}
              measurements={measurements}
              measurementMode={measurementMode}
              performanceMode={performanceMode}
              recommendations={recommendations}
              savedSceneName={savedSceneName}
              sceneMessage={sceneMessage}
              selectedLesson={selectedLesson}
              selectedExampleId={selectedExampleId}
              selectedSolid={selectedSolid}
              teacherMode={teacherMode}
              onAddAnimation={props.onAddAnimation}
              onAddMeasurement={props.onAddMeasurement}
              onCaptureScene={props.onCaptureScene}
              onClearMeasurements={props.onClearMeasurements}
              onExampleChange={props.onExampleChange}
              onExportSceneJson={props.onExportSceneJson}
              onImportScene={props.onImportScene}
              onLoadScene={props.onLoadScene}
              onSaveScene={props.onSaveScene}
              onSetActiveToolTab={props.onSetActiveToolTab}
              onSetComparison={props.onSetComparison}
              onSetImportSceneJson={props.onSetImportSceneJson}
              onSetMeasurementMode={props.onSetMeasurementMode}
              onSetPerformanceMode={props.onSetPerformanceMode}
              onSetSavedSceneName={props.onSetSavedSceneName}
              onSetTeacherMode={props.onSetTeacherMode}
              onUpdateAnimationStatus={props.onUpdateAnimationStatus}
            />

            <ARFormulaPanel classification={classification} selectedExample={selectedExample} />
            <ARMeasurementTool measurements={measurements} />
          </div>
        </details>
      </div>
    </SectionCard>
  );
}

function ARAdvancedToolsPanel({
  activeToolTab,
  animations,
  comparison,
  comparisonText,
  generatedGraphs,
  generatedSolids,
  importSceneJson,
  measurements,
  measurementMode,
  performanceMode,
  recommendations,
  savedSceneName,
  sceneMessage,
  selectedLesson,
  selectedExampleId,
  selectedSolid,
  teacherMode,
  onAddAnimation,
  onAddMeasurement,
  onCaptureScene,
  onClearMeasurements,
  onExampleChange,
  onExportSceneJson,
  onImportScene,
  onLoadScene,
  onSaveScene,
  onSetActiveToolTab,
  onSetComparison,
  onSetImportSceneJson,
  onSetMeasurementMode,
  onSetPerformanceMode,
  onSetSavedSceneName,
  onSetTeacherMode,
  onUpdateAnimationStatus,
}: {
  activeToolTab: ARAdvancedToolTab;
  animations: ARAnimation[];
  comparison: ARComparison;
  comparisonText: string;
  generatedGraphs: ARGeneratedGraphObject[];
  generatedSolids: ARGeneratedGeometrySolid[];
  importSceneJson: string;
  measurements: ARMeasurement[];
  measurementMode: ARMeasurementType | "off";
  performanceMode: boolean;
  recommendations: string[];
  savedSceneName: string;
  sceneMessage: string;
  selectedLesson: ReturnType<typeof lessonFor>;
  selectedExampleId: string;
  selectedSolid?: ARGeneratedGeometrySolid;
  teacherMode: boolean;
  onAddAnimation: (target?: ARAnimation["target"]) => void;
  onAddMeasurement: (type?: ARMeasurementType) => void;
  onCaptureScene: () => void;
  onClearMeasurements: () => void;
  onExampleChange: (exampleId: string) => void;
  onExportSceneJson: () => void;
  onImportScene: () => void;
  onLoadScene: () => void;
  onSaveScene: () => void;
  onSetActiveToolTab: (tab: ARAdvancedToolTab) => void;
  onSetComparison: (comparison: ARComparison) => void;
  onSetImportSceneJson: (value: string) => void;
  onSetMeasurementMode: (mode: ARMeasurementType | "off") => void;
  onSetPerformanceMode: (enabled: boolean) => void;
  onSetSavedSceneName: (value: string) => void;
  onSetTeacherMode: (enabled: boolean) => void;
  onUpdateAnimationStatus: (id: string, status: ARAnimation["status"]) => void;
}) {
  const objectOptions = [...generatedGraphs.map((graph) => ({ id: graph.id, label: graph.name })), ...generatedSolids.map((solid) => ({ id: solid.id, label: solid.name }))];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <p className="text-sm font-black">Advanced tools</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {advancedTabs.map((tab) => <button key={tab.id} type="button" className={activeToolTab === tab.id ? "action-primary min-h-10 justify-center rounded-xl text-xs" : "tool-button min-h-10 justify-center rounded-xl text-xs"} onClick={() => onSetActiveToolTab(tab.id)}>{tab.label}</button>)}
      </div>

      <div className="mt-3 space-y-3">
        {activeToolTab === "measure" ? (
          <>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Measurement Mode
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={measurementMode} onChange={(event) => onSetMeasurementMode(event.target.value as ARMeasurementType | "off")}>
                <option value="off">Off</option>
                {measurementTypes.map((type) => <option key={type} value={type}>{readableDimensionName(type)}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <ControlButton label="Add Point" icon={<Plus className="h-4 w-4" />} onClick={() => onAddMeasurement()} />
              <ControlButton label="Clear Measurement" icon={<X className="h-4 w-4" />} onClick={onClearMeasurements} />
            </div>
            <MeasurementList measurements={measurements} />
          </>
        ) : null}

        {activeToolTab === "animate" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ControlButton label="Parameter" icon={<Waves className="h-4 w-4" />} onClick={() => onAddAnimation("parameter")} />
              <ControlButton label="Dimension" icon={<Ruler className="h-4 w-4" />} onClick={() => onAddAnimation("dimension")} />
              <ControlButton label="Rotation" icon={<RotateCwSquare className="h-4 w-4" />} onClick={() => onAddAnimation("rotation")} />
              <ControlButton label="Cross Section" icon={<ScanLine className="h-4 w-4" />} onClick={() => onAddAnimation("cross_section")} />
            </div>
            {animations.map((animation) => (
              <div key={animation.id} className="rounded-xl bg-slate-50 p-3 text-xs font-semibold dark:bg-white/5">
                <p className="font-black">{readableDimensionName(animation.target)}: {animation.property}</p>
                <p>{animation.from} to {animation.to} in {animation.durationMs / 1000}s - {animation.status}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button className="tool-button rounded-xl text-xs" type="button" onClick={() => onUpdateAnimationStatus(animation.id, "playing")}>Play</button>
                  <button className="tool-button rounded-xl text-xs" type="button" onClick={() => onUpdateAnimationStatus(animation.id, "paused")}>Pause</button>
                  <button className="tool-button rounded-xl text-xs" type="button" onClick={() => onUpdateAnimationStatus(animation.id, "stopped")}>Stop</button>
                </div>
              </div>
            ))}
          </>
        ) : null}

        {activeToolTab === "learn" ? (
          <div className={`${teacherMode ? "text-base" : "text-sm"} rounded-2xl bg-cyan-50 p-3 dark:bg-cyan-300/10`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-black">{selectedLesson.title}</p>
              <CheckToggle label="Teacher Mode" checked={teacherMode} onChange={onSetTeacherMode} />
            </div>
            <p className="mt-2 font-semibold leading-6">{selectedLesson.concept}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide">Key observations</p>
            <ul className="mt-1 space-y-1 text-xs font-semibold">{selectedLesson.keyObservations.map((item) => <li key={item}>- {item}</li>)}</ul>
            <p className="mt-3 text-xs font-black uppercase tracking-wide">Try</p>
            <ul className="mt-1 space-y-1 text-xs font-semibold">{selectedLesson.tryThis.map((item) => <li key={item}>- {item}</li>)}</ul>
            {selectedLesson.questions?.map((question) => <p key={question} className="mt-2 rounded-xl bg-white p-2 text-xs font-black dark:bg-slate-950/60">{question}</p>)}
          </div>
        ) : null}

        {activeToolTab === "practice" ? (
          <ARPracticeStudio
            selectedExampleId={selectedExampleId}
            onAddMeasurement={onAddMeasurement}
            onCaptureScene={onCaptureScene}
            onExampleChange={onExampleChange}
            onSetActiveToolTab={onSetActiveToolTab}
          />
        ) : null}

        {activeToolTab === "compare" ? (
          <>
            <CheckToggle label="Enable Comparison Mode" checked={comparison.enabled} onChange={(enabled) => onSetComparison({ ...comparison, enabled })} />
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Object A
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={comparison.objectAId ?? ""} onChange={(event) => onSetComparison({ ...comparison, objectAId: event.target.value })}>
                <option value="">Select object</option>
                {objectOptions.map((object) => <option key={object.id} value={object.id}>{object.label}</option>)}
              </select>
            </label>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Object B
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={comparison.objectBId ?? ""} onChange={(event) => onSetComparison({ ...comparison, objectBId: event.target.value })}>
                <option value="">Select object</option>
                {objectOptions.map((object) => <option key={object.id} value={object.id}>{object.label}</option>)}
              </select>
            </label>
            <p className="rounded-xl bg-violet-50 p-3 text-xs font-bold leading-5 text-violet-900 dark:bg-violet-300/10 dark:text-violet-100">{comparisonText}</p>
          </>
        ) : null}

        {activeToolTab === "scene" ? (
          <>
            <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" value={savedSceneName} onChange={(event) => onSetSavedSceneName(event.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <ControlButton label="Save Scene" icon={<Plus className="h-4 w-4" />} onClick={onSaveScene} />
              <ControlButton label="Load Scene" icon={<RotateCcw className="h-4 w-4" />} onClick={onLoadScene} />
              <ControlButton label="Export JSON" icon={<Sparkles className="h-4 w-4" />} onClick={onExportSceneJson} />
              <ControlButton label="Capture" icon={<Camera className="h-4 w-4" />} onClick={onCaptureScene} />
            </div>
            <textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-mono dark:border-white/10 dark:bg-slate-950" value={importSceneJson} onChange={(event) => onSetImportSceneJson(event.target.value)} placeholder="Paste AR Math Lab scene JSON here." />
            <div className="grid grid-cols-2 gap-2">
              <ControlButton label="Export Scene JSON" icon={<Sparkles className="h-4 w-4" />} onClick={onExportSceneJson} />
              <ControlButton label="Import Scene JSON" icon={<Plus className="h-4 w-4" />} onClick={onImportScene} />
            </div>
          </>
        ) : null}

        {activeToolTab === "settings" || activeToolTab === "formula" || activeToolTab === "build" || activeToolTab === "graph" || activeToolTab === "geometry" ? (
          <div className="space-y-2">
            {activeToolTab === "settings" ? <CheckToggle label="Performance Mode" checked={performanceMode} onChange={onSetPerformanceMode} /> : null}
            {activeToolTab === "graph" ? <p className="rounded-xl bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100">Graph settings are above. Performance Mode caps surfaces near 40 x 40 and curves near 220 samples for smoother mobile use.</p> : null}
            {activeToolTab === "geometry" ? <p className="rounded-xl bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100">Geometry builder preserves real dimensions. Performance Mode lowers solid quality and hides non-essential labels.</p> : null}
            {recommendations.map((item) => <p key={item} className="rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100">{item}</p>)}
            {selectedSolid ? <ARGeometryFormulaPanel solid={selectedSolid} /> : null}
          </div>
        ) : null}

        {sceneMessage ? <p className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">{sceneMessage}</p> : null}
      </div>
    </div>
  );
}

function MeasurementList({ measurements }: { measurements: ARMeasurement[] }) {
  if (!measurements.length) return <p className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">No measurements yet.</p>;
  return (
    <div className="space-y-2">
      {measurements.map((measurement) => <p key={measurement.id} className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">{measurement.label}</p>)}
    </div>
  );
}

function ARPracticeStudio({
  selectedExampleId,
  onAddMeasurement,
  onCaptureScene,
  onExampleChange,
  onSetActiveToolTab,
}: {
  selectedExampleId: string;
  onAddMeasurement: (type?: ARMeasurementType) => void;
  onCaptureScene: () => void;
  onExampleChange: (exampleId: string) => void;
  onSetActiveToolTab: (tab: ARAdvancedToolTab) => void;
}) {
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<string[]>(() => readPracticeCompletion());
  const filtered = arPracticeActivities.filter((activity) => {
    const haystack = `${activity.title} ${activity.topic} ${activity.level} ${activity.goal}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function toggleComplete(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem("ar-math-lab-practice-completed", JSON.stringify(next));
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-cyan-50 p-3 dark:bg-cyan-300/10">
        <p className="text-sm font-black">Student Practice Studio</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">GeoGebra-style activities: load a model, place it, walk around, measure, animate, compare, capture evidence, and explain what changed.</p>
      </div>
      <input
        aria-label="Search AR practice activities"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
        placeholder="Search surfaces, solids, measurement..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid gap-2">
        {filtered.map((activity) => {
          const active = selectedExampleId === activity.exampleId;
          const done = completed.includes(activity.id);
          return (
            <div key={activity.id} className={`rounded-2xl border p-3 ${active ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black">{activity.title}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-slate-500">{activity.topic} - {activity.level}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-black ${done ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-100" : "bg-white text-slate-500 dark:bg-slate-950/60 dark:text-slate-300"}`}>{done ? "Complete" : "Open"}</span>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{activity.goal}</p>
              <ol className="mt-2 space-y-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
                {activity.steps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
              </ol>
              <details className="mt-2 rounded-xl bg-white p-2 text-xs font-semibold dark:bg-slate-950/60">
                <summary className="cursor-pointer font-black">Hints</summary>
                <ul className="mt-2 space-y-1">{activity.hints.map((hint) => <li key={hint}>- {hint}</li>)}</ul>
              </details>
              <p className="mt-2 rounded-xl bg-violet-50 p-2 text-xs font-bold leading-5 text-violet-900 dark:bg-violet-300/10 dark:text-violet-100">{activity.evidencePrompt}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="action-primary min-h-10 rounded-xl text-xs" type="button" onClick={() => onExampleChange(activity.exampleId)}>Load Activity</button>
                <button className="tool-button min-h-10 rounded-xl text-xs" type="button" onClick={() => toggleComplete(activity.id)}>{done ? "Mark Open" : "Mark Complete"}</button>
                {activity.expectedActions.includes("measure") ? <button className="tool-button min-h-10 rounded-xl text-xs" type="button" onClick={() => onAddMeasurement("distance")}>Add Measure</button> : null}
                {activity.expectedActions.includes("animate") ? <button className="tool-button min-h-10 rounded-xl text-xs" type="button" onClick={() => onSetActiveToolTab("animate")}>Open Animate</button> : null}
                {activity.expectedActions.includes("compare") ? <button className="tool-button min-h-10 rounded-xl text-xs" type="button" onClick={() => onSetActiveToolTab("compare")}>Open Compare</button> : null}
                {activity.expectedActions.includes("capture") ? <button className="tool-button min-h-10 rounded-xl text-xs" type="button" onClick={onCaptureScene}>Capture Evidence</button> : null}
              </div>
            </div>
          );
        })}
      </div>
      {!filtered.length ? <p className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-400">No practice activities match that search.</p> : null}
    </div>
  );
}

function GraphSettingsPanel({
  classification,
  graphSettings,
  onChange,
}: {
  classification: EquationClassificationResult;
  graphSettings: ARGraphSettings;
  onChange: <K extends keyof ARGraphSettings>(key: K, value: ARGraphSettings[K]) => void;
}) {
  const renderer = classification.suggestedRenderer;
  const isCurve = renderer === "curve_3d";
  const isParametricSurface = renderer === "parametric_surface_mesh" || renderer?.startsWith("predefined");
  const isSurface = renderer === "surface_mesh";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black">Graph settings</p>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-black text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-100">{renderer ?? "not renderable"}</span>
      </div>

      {isSurface ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RangeField label="x range" value={graphSettings.xRange} onChange={(value) => onChange("xRange", value)} />
          <RangeField label="y range" value={graphSettings.yRange} onChange={(value) => onChange("yRange", value)} />
          <NumberField label="x resolution" min={8} max={120} step={1} value={graphSettings.resolutionX} onChange={(value) => onChange("resolutionX", value)} />
          <NumberField label="y resolution" min={8} max={120} step={1} value={graphSettings.resolutionY} onChange={(value) => onChange("resolutionY", value)} />
        </div>
      ) : null}

      {isCurve ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RangeField label="t range" value={graphSettings.tRange} onChange={(value) => onChange("tRange", value)} />
          <NumberField label="samples" min={20} max={1000} step={10} value={graphSettings.samples} onChange={(value) => onChange("samples", value)} />
          <NumberField label="curve thickness" min={0.01} max={0.18} step={0.005} value={graphSettings.curveThickness} onChange={(value) => onChange("curveThickness", value)} />
        </div>
      ) : null}

      {isParametricSurface ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RangeField label="u range" value={graphSettings.uRange} onChange={(value) => onChange("uRange", value)} />
          <RangeField label="v range" value={graphSettings.vRange} onChange={(value) => onChange("vRange", value)} />
          <NumberField label="u resolution" min={8} max={120} step={1} value={graphSettings.resolutionU} onChange={(value) => onChange("resolutionU", value)} />
          <NumberField label="v resolution" min={8} max={120} step={1} value={graphSettings.resolutionV} onChange={(value) => onChange("resolutionV", value)} />
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField label="graph scale" min={0.1} max={5} step={0.1} value={graphSettings.graphScale} onChange={(value) => onChange("graphScale", value)} />
        <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          z scale
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={graphSettings.zScale === "auto" ? "auto" : String(graphSettings.zScale)} onChange={(event) => onChange("zScale", event.target.value === "auto" ? "auto" : Number(event.target.value))}>
            <option value="auto">auto</option>
            <option value="0.25">0.25</option>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <CheckToggle label="transparent" checked={graphSettings.transparent} onChange={(checked) => onChange("transparent", checked)} />
        <CheckToggle label="wireframe" checked={graphSettings.wireframe} onChange={(checked) => onChange("wireframe", checked)} />
        <CheckToggle label="point marks" checked={graphSettings.pointMarkers} onChange={(checked) => onChange("pointMarkers", checked)} />
        <CheckToggle label="auto center" checked={graphSettings.autoCenter} onChange={(checked) => onChange("autoCenter", checked)} />
      </div>
    </div>
  );
}

function ObjectListPanel({
  graphs,
  selectedGraphId,
  onSelectGraph,
}: {
  graphs: ARGeneratedGraphObject[];
  selectedGraphId?: string;
  onSelectGraph: (id: string | undefined) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-black">Generated objects</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{graphs.length}</span>
      </div>
      {graphs.length ? (
        <div className="mt-3 space-y-2">
          {graphs.map((graph) => (
            <button
              key={graph.id}
              type="button"
              onClick={() => onSelectGraph(graph.id)}
              className={`w-full rounded-2xl border p-3 text-left transition ${selectedGraphId === graph.id ? "border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-300/50 dark:bg-cyan-300/10 dark:text-cyan-50" : "border-slate-200 bg-slate-50 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`}
            >
              <p className="text-sm font-black">{graph.name}</p>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{graph.equation}</p>
              <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-slate-400">{graph.status ?? "ready"} - {graph.geometry.kind} - {graph.geometry.warnings.length} warnings</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">Generate a graph to add a renderable AR math object.</p>
      )}
    </div>
  );
}

function ARGeometryBuilder({
  builderType,
  builderUnit,
  selectedSolid,
  onDuplicate,
  onGenerateSolid,
  onSetBuilderType,
  onSetBuilderUnit,
  onUpdateCustomScale,
  onUpdateDimension,
  onUpdateScale,
  onUpdateSettings,
}: {
  builderType: ARSolidType;
  builderUnit: ARUnit;
  selectedSolid?: ARGeneratedGeometrySolid;
  onDuplicate: () => void;
  onGenerateSolid: () => void;
  onSetBuilderType: (type: ARSolidType) => void;
  onSetBuilderUnit: (unit: ARUnit) => void;
  onUpdateCustomScale: (value: number) => void;
  onUpdateDimension: (key: string, value: number) => void;
  onUpdateScale: (mode: ARScaleMode) => void;
  onUpdateSettings: (delta: Partial<ARGeneratedGeometrySolid["settings"]>) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black">Geometry Builder</p>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black text-violet-800 dark:bg-violet-300/10 dark:text-violet-100">real dimensions</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Object Type
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={builderType} onChange={(event) => onSetBuilderType(event.target.value as ARSolidType)}>
            {Object.entries(solidTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Unit
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={builderUnit} onChange={(event) => onSetBuilderUnit(event.target.value as ARUnit)}>
            {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">Type a natural instruction above, for example: Cone radius 5 cm height 12 cm. The builder keeps dimensions in the user unit and converts to meters for AR scale.</p>
      <ControlButton label="Generate Solid" icon={<Cuboid className="h-4 w-4" />} onClick={onGenerateSolid} primary />

      {selectedSolid ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <p className="font-black text-cyan-900 dark:text-cyan-100">{selectedSolid.name}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{selectedSolid.explanation}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Scale Mode
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={selectedSolid.displayScaleMode} onChange={(event) => onUpdateScale(event.target.value as ARScaleMode)}>
                {Object.entries(scaleModeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <NumberField label="custom scale" min={0.05} max={20} step={0.05} value={selectedSolid.customScale} onChange={onUpdateCustomScale} />
          </div>
          <p className="rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100">Original dimensions are preserved. Only the AR display scale has changed.</p>
          <div className="space-y-3">
            {Object.entries(selectedSolid.dimensions).filter(([key]) => key !== "baseType").map(([key, dimension]) => (
              <label key={key} className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {readableDimensionName(key)} = {formatNumber(dimension.value)} {dimension.unit}
                <input className="mt-2 w-full accent-cyan-500" type="range" min={0.1} max={key.toLowerCase().includes("height") ? 200 : 100} step={0.1} value={dimension.value} onChange={(event) => onUpdateDimension(key, Number(event.target.value))} />
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CheckToggle label="labels" checked={selectedSolid.settings.showLabels} onChange={(checked) => onUpdateSettings({ showLabels: checked })} />
            <CheckToggle label="formulas" checked={selectedSolid.settings.showFormula} onChange={(checked) => onUpdateSettings({ showFormula: checked })} />
            <CheckToggle label="wireframe" checked={selectedSolid.settings.showWireframe} onChange={(checked) => onUpdateSettings({ showWireframe: checked })} />
            <CheckToggle label="transparent" checked={selectedSolid.settings.transparent} onChange={(checked) => onUpdateSettings({ transparent: checked })} />
            <CheckToggle label="dimension lines" checked={selectedSolid.settings.showDimensionLines} onChange={(checked) => onUpdateSettings({ showDimensionLines: checked })} />
            <CheckToggle label="cross section" checked={selectedSolid.settings.showCrossSection} onChange={(checked) => onUpdateSettings({ showCrossSection: checked, crossSectionMode: checked ? "horizontal" : "off" })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cross Section
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={selectedSolid.settings.crossSectionMode} onChange={(event) => onUpdateSettings({ crossSectionMode: event.target.value as ARCrossSectionMode, showCrossSection: event.target.value !== "off" })}>
                {Object.entries(crossSectionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Quality
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" value={selectedSolid.settings.quality} onChange={(event) => onUpdateSettings({ quality: event.target.value as ARGeometryQuality })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          {selectedSolid.settings.quality === "high" ? <p className="rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800 dark:bg-amber-300/10 dark:text-amber-100">High quality may slow down low-end mobile devices.</p> : null}
          <ControlButton label="Duplicate" icon={<Plus className="h-4 w-4" />} onClick={onDuplicate} />
          <ARGeometryFormulaPanel solid={selectedSolid} />
        </div>
      ) : null}
    </div>
  );
}

function GeometryObjectListPanel({ onSelectSolid, selectedSolidId, solids }: { solids: ARGeneratedGeometrySolid[]; selectedSolidId?: string; onSelectSolid: (id: string | undefined) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-black">Geometry solids</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{solids.length}</span>
      </div>
      {solids.length ? (
        <div className="mt-3 space-y-2">
          {solids.map((solid) => (
            <button key={solid.id} type="button" onClick={() => onSelectSolid(solid.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedSolidId === solid.id ? "border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-300/50 dark:bg-violet-300/10 dark:text-violet-50" : "border-slate-200 bg-slate-50 hover:border-violet-200 dark:border-white/10 dark:bg-white/5"}`}>
              <p className="text-sm font-black">{solid.name}</p>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{solid.createdFromInput}</p>
              <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-slate-400">{solid.status ?? "ready"} - {scaleModeLabels[solid.displayScaleMode]} - {solid.unit}</p>
            </button>
          ))}
        </div>
      ) : <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">Generate a solid to add real-dimension geometry to the AR scene.</p>}
    </div>
  );
}

function ARGeometryFormulaPanel({ solid }: { solid: ARGeneratedGeometrySolid }) {
  if (!solid.settings.showFormula) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black">{solid.name} formulas</p>
      <div className="mt-2 space-y-2">
        {solid.calculatedValues.formulas.map((line) => (
          <div key={line.label} className="rounded-xl bg-white p-3 text-xs font-semibold leading-5 dark:bg-slate-950/60">
            <p className="font-black">{line.label}</p>
            <p>{line.formula}</p>
            <p>{line.substitution}</p>
            <p className="text-cyan-700 dark:text-cyan-200">{line.result}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 rounded-xl bg-cyan-50 p-3 text-xs font-bold text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100">AR internal scale: {Object.entries(solid.calculatedValues.internalMeters).filter(([key]) => key !== "baseType").map(([key, value]) => `${readableDimensionName(key)} ${formatNumber(value)} m`).join(", ")}</p>
      {solid.warnings.length ? <p className="mt-2 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800 dark:bg-amber-300/10 dark:text-amber-100">{solid.warnings.join(" ")}</p> : null}
    </div>
  );
}

function RangeField({ label, onChange, value }: { label: string; value: [number, number]; onChange: (value: [number, number]) => void }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2 dark:bg-white/5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input aria-label={`${label} minimum`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" type="number" value={value[0]} onChange={(event) => onChange([Number(event.target.value), value[1]])} />
        <input aria-label={`${label} maximum`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" type="number" value={value[1]} onChange={(event) => onChange([value[0], Number(event.target.value)])} />
      </div>
    </div>
  );
}

function NumberField({ label, max, min, onChange, step, value }: { label: string; max?: number; min?: number; value: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-xl bg-slate-50 p-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
      {label}
      <input className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal dark:border-white/10 dark:bg-slate-950" type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function CheckToggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      <input className="accent-cyan-500" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

export function ARSessionManager({ sessionState, support }: { sessionState: ARSessionState; support: ARSupportStatus }) {
  return (
    <SectionCard title="Session Manager" description="State container for mobile camera AR, camera preview, and 3D fallback lifecycle." compact>
      <div className="grid gap-3 md:grid-cols-3">
        <PreviewTile icon={<Camera className="h-5 w-5" />} title="ARSessionManager" text={`${sessionState.mode} / ${sessionState.status}`} />
        <PreviewTile icon={<Move3D className="h-5 w-5" />} title="ARObjectPlacement" text={sessionState.mode === "ar" && support.cameraAvailable ? "Live camera placement is active." : "Fallback placement guide is active."} />
        <PreviewTile icon={<Ruler className="h-5 w-5" />} title="ARMeasurementTool" text="Unit-aware measurements stay ready in the live camera overlay." />
      </div>
    </SectionCard>
  );
}

export function ARMeasurementTool({ measurements = [] }: { measurements?: ARMeasurement[] }) {
  const text = measurements.length ? `${measurements.length} measurement${measurements.length === 1 ? "" : "s"} active. Labels stay lightweight for AR and camera overlay modes.` : "Use Measure tools to add distance, angle, radius, height, and dimension measurements.";
  return <InfoBox icon={<Ruler className="h-4 w-4 text-cyan-600" />} title="Measurement tool" text={text} />;
}

export function ARHelpPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="flex items-center gap-2 text-sm font-black"><HelpCircle className="h-4 w-4 text-violet-500" />GeoGebra-style AR Help</p>
      <ul className="mt-2 space-y-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
        <li>- AR Mode uses the phone camera with an interactive 3D math overlay.</li>
        <li>- Drag with one finger to place the object; use two fingers to scale and rotate.</li>
        <li>- 3D Preview works on every supported desktop browser and is best for practice before using AR.</li>
        <li>- Use Practice Studio to load a task, place the object, walk around, measure, capture evidence, and explain.</li>
        <li>- Use Performance Mode on phones if surfaces or animations feel slow.</li>
      </ul>
    </div>
  );
}

export function ARFormulaPanel({ classification, selectedExample }: { classification: EquationClassificationResult; selectedExample: ARExample }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <p className="flex items-center gap-2 text-sm font-black"><Sparkles className="h-4 w-4 text-violet-500" /> Formula, explanation, and renderer</p>
      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-center text-base font-black dark:bg-white/5"><MathExpression value={classification.normalizedInput || selectedExample.input} /></div>
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{selectedExample.description}</p>
      {classification.educationalHint ? <p className="mt-2 rounded-xl bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-50">{classification.educationalHint}</p> : null}
    </div>
  );
}

function ControlButton({ disabled = false, icon, label, onClick, primary = false }: { disabled?: boolean; icon: JSX.Element; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" disabled={disabled} aria-label={label} onClick={onClick} className={`${primary ? "action-primary" : "tool-button"} min-h-11 justify-center rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50`}>
      {icon}<span className="text-xs">{label}</span>
    </button>
  );
}

function ToggleButton({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return <button type="button" aria-pressed={checked} onClick={onClick} className={checked ? "action-primary min-h-11 justify-center rounded-2xl text-xs" : "tool-button min-h-11 justify-center rounded-2xl text-xs"}>{label}</button>;
}

function StatusBadge({ label, value, tone }: { label: string; value: string; tone: "ready" | "idle" }) {
  const toneClass = tone === "ready" ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100" : "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200";
  return (
    <div className={`rounded-2xl border px-3 py-2 ${toneClass}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-1 truncate">{value}</p>
    </div>
  );
}

function PreviewTile({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">{icon}</div>
      <p className="mt-3 text-sm font-black">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

function InfoBox({ icon, text, title }: { icon: JSX.Element; text: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="flex items-center gap-2 text-sm font-black">{icon}{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

function readableDimensionName(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formulaSummaryForOverlay(solid: ARGeneratedGeometrySolid) {
  return solid.calculatedValues.formulas.slice(0, 2).map((line) => line.result).join(" - ");
}

async function requestEnvironmentCameraStream() {
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices?.getUserMedia) throw new Error("Camera access is not available.");
  const attempts: MediaStreamConstraints[] = [
    { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: true, audio: false },
  ];
  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await getCameraStreamWithTimeout(mediaDevices, constraints, 6000);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function getCameraStreamWithTimeout(mediaDevices: MediaDevices, constraints: MediaStreamConstraints, timeoutMs: number) {
  let timedOut = false;
  const request = mediaDevices.getUserMedia(constraints).then((stream) => {
    if (timedOut) {
      stopCameraTracks(stream);
      throw new Error("Camera request timed out.");
    }
    return stream;
  });
  const timeout = new Promise<MediaStream>((_, reject) => {
    window.setTimeout(() => {
      timedOut = true;
      reject(new Error("Camera request timed out."));
    }, timeoutMs);
  });
  return Promise.race([request, timeout]);
}

function stopCameraTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function readPracticeCompletion() {
  try {
    const raw = localStorage.getItem("ar-math-lab-practice-completed");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function cameraErrorMessage(error: unknown) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError") return "Camera permission was denied. Enable camera access or use 3D Preview Mode.";
  if (name === "NotFoundError") return "No camera was found on this device.";
  if (name === "NotReadableError") return "Camera is already being used by another application.";
  if (name === "OverconstrainedError") return "The requested environment camera is not available. 3D Preview Mode is available.";
  return "Unable to start camera preview. 3D Preview Mode is available.";
}

function isLearningEventType(value: string): value is ARLearningEventType {
  return [
    "equation_entered",
    "equation_classified",
    "graph_generated",
    "graph_parameter_changed",
    "graph_range_changed",
    "geometry_created",
    "geometry_dimension_changed",
    "unit_changed",
    "scale_mode_changed",
    "measurement_added",
    "animation_started",
    "animation_paused",
    "animation_completed",
    "cross_section_changed",
    "object_compared",
    "object_selected",
    "object_placed",
    "mode_changed",
    "error_occurred",
  ].includes(value);
}

function roundTo(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
