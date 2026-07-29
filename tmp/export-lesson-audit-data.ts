import { writeFileSync } from "node:fs";
import { lessonCatalog } from "../src/modules/lessons/catalog/lessonCatalog";
import { schoolLessonCatalog } from "../src/modules/lessons/catalog/school/schoolSyllabusCatalog";
import { advancedConceptLessons } from "../src/modules/lessons/catalog/advanced/advancedConceptLessons";
import { advancedConceptPathways } from "../src/modules/lessons/catalog/advanced/advancedConceptPathways";

writeFileSync(
  "tmp/lesson-audit-data.json",
  JSON.stringify(
    {
      core: lessonCatalog,
      school: schoolLessonCatalog,
      advanced: advancedConceptLessons,
      advancedPathways: advancedConceptPathways,
    },
    null,
    2,
  ),
);
