import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from "ogl";

interface DarkVeilProps {
  className?: string;
}

export const DarkVeil = ({ className = "" }: DarkVeilProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const gl = container.appendChild(document.createElement("canvas")).getContext("webgl", {
      antialias: true,
      alpha: true,
    });

    if (!gl) return;

    const renderer = new Renderer({ gl, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor("#000000", 0);
    rendererRef.current = renderer;

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();
    sceneRef.current = scene;

    // Vertex shader
    const vertex = /* glsl */ `
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader - Dark Veil effect
    const fragment = /* glsl */ `
      precision highp float;
      
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec2 p = (uv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        
        // Animated dark veil pattern
        float time = uTime * 0.5;
        float dist = length(p);
        
        // Create veil-like effect with multiple layers
        float veil1 = sin(dist * 3.0 - time) * 0.5 + 0.5;
        float veil2 = sin(dist * 5.0 + time * 0.7) * 0.5 + 0.5;
        float veil3 = sin(dist * 7.0 - time * 0.9) * 0.5 + 0.5;
        
        // Combine veils with dark gradient
        float combined = (veil1 * 0.4 + veil2 * 0.3 + veil3 * 0.3) * 0.3;
        combined += smoothstep(0.5, 1.5, dist) * 0.7;
        
        // Dark color with subtle variations
        vec3 color = vec3(0.05, 0.05, 0.08);
        color += vec3(0.02, 0.01, 0.03) * combined;
        
        gl_FragColor = vec4(color, 0.95);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
      },
    });

    // Create a fullscreen quad geometry
    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: new Float32Array([
          -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0,
        ]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      index: {
        data: new Uint16Array([0, 1, 2, 1, 3, 2]),
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    mesh.setParent(scene);
    meshRef.current = mesh;

    let time = 0;
    const animate = () => {
      time += 0.016; // ~60fps
      
      if (program.uniforms.uTime) {
        program.uniforms.uTime.value = time;
      }
      
      renderer.render({ scene, camera });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({
        aspect: container.clientWidth / container.clientHeight,
      });
      if (program.uniforms.uResolution) {
        program.uniforms.uResolution.value = [
          container.clientWidth,
          container.clientHeight,
        ];
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (container && container.lastChild) {
        container.removeChild(container.lastChild);
      }
      if (gl) {
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

