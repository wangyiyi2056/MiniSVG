<template>
  <section class="about-section">
    <h2>关于 SVG 优化工具</h2>
    <div class="about-content">
      <p>这是一个专业的 SVG 文件优化工具，旨在帮助设计师和开发者：</p>
      <ul>
        <li>🔍 清理和优化 SVG 代码</li>
        <li>📦 减小 SVG 文件体积</li>
        <li>🛠️ 删除不必要的元素和属性</li>
        <li>💻 提供即时的在线预览</li>
      </ul>
      <p class="highlight">
        简单拖放或粘贴您的 SVG 文件，即可获得优化后的结果！
      </p>
    </div>
  </section>
</template>

<style scoped>
  .about-section {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .about-section h2 {
    color: var(--accent-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .about-content {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .about-content ul {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
  }

  .about-content li {
    margin: 0.8rem 0;
    padding-left: 1.5rem;
    position: relative;
  }

  .about-content li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background-color: var(--accent-color);
    border-radius: 50%;
  }

  .highlight {
    background: linear-gradient(45deg, #2c3e50, #3498db);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-top: 1.5rem;
  }
</style>
