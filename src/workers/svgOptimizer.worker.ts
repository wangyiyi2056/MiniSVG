import { optimize } from 'svgo';

self.onmessage = async (e) => {
  const { content, filename } = e.data;
  
  try {
    self.postMessage({ 
      type: 'progress', 
      data: { 
        filename,
        progress: 0 
      } 
    });

    const result = optimize(content, {
      multipass: true,
      plugins: [
        "removeDoctype",
        "removeXMLProcInst",
        "removeComments",
        "removeMetadata",
        "removeEditorsNSData",
        "cleanupAttrs",
        "mergeStyles",
        "inlineStyles",
        "minifyStyles",
        "removeUselessDefs",
        "cleanupNumericValues",
        "convertColors",
        "removeUnknownsAndDefaults",
        "removeNonInheritableGroupAttrs",
        "removeUselessStrokeAndFill",
        "removeViewBox",
        "cleanupEnableBackground",
        "removeHiddenElems",
        "removeEmptyText",
        "convertShapeToPath",
        "convertEllipseToCircle",
        "moveElemsAttrsToGroup",
        "moveGroupAttrsToElems",
        "collapseGroups",
        "convertPathData",
        "convertTransform",
        "removeEmptyAttrs",
        "removeEmptyContainers",
        "mergePaths",
        "removeUnusedNS",
        "sortDefsChildren",
        "removeTitle",
        "removeDesc",
      ],
    });

    // 模拟进度
    self.postMessage({ 
      type: 'progress', 
      data: { 
        filename,
        progress: 50 
      } 
    });

    // 发送完成消息
    self.postMessage({
      type: 'complete',
      data: {
        name: filename,
        original: content,
        optimized: result.data,
        savings: ((new Blob([content]).size - new Blob([result.data]).size) / new Blob([content]).size) * 100
      }
    });
  } catch (error: unknown) {
    self.postMessage({ 
      type: 'error', 
      data: { 
        filename,
        error: error instanceof Error ? error.message : String(error)
      } 
    });
  }
}; 