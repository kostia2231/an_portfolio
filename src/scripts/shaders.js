export const vertexShader = `
  uniform float uScrollIntensity;
  varying vec2 vUv;
  void main() {
      vUv = uv; // Passing texture coordinates (uv) to the fragment shader
      vec3 pos = position;
      // Apply distortion based on scroll intensity
      float sideDistortion = sin(uv.y * 3.14159) * uScrollIntensity * 0.5;
      float topBottomDistortion = sin(uv.x * 3.14159) * uScrollIntensity * 0.5;
      pos.z += sideDistortion + topBottomDistortion;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); // Calculate final vertex position
  }
`;

export const fragmentShader = `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uNextTexture;
  uniform float uScrollPosition;
  varying vec2 vUv;
  void main() {
      float normalizedPosition = fract(uScrollPosition);
      vec2 currentUv = vec2(vUv.x, mod(vUv.y - normalizedPosition, 1.0));
      vec2 nextUv = vec2(vUv.x, mod(vUv.y + 1.0 - normalizedPosition, 1.0));
      // Sample current and next textures based on UV coordinates
      if (vUv.y < normalizedPosition) {
          gl_FragColor = texture2D(uNextTexture, nextUv);
      } else {
          gl_FragColor = texture2D(uCurrentTexture, currentUv);
      }
  }
`;

export const alternateFragmentShader = `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uNextTexture;
  uniform float uScrollPosition;
  uniform float uScrollIntensity;
  varying vec2 vUv;
  void main() {
      float normalizedPosition = fract(uScrollPosition);
      vec2 currentUv = vec2(vUv.x, mod(vUv.y - normalizedPosition, 1.0));
      vec2 nextUv = vec2(vUv.x, mod(vUv.y + 1.0 - normalizedPosition, 1.0));

      // Add some different effect for the alternate shader
      vec2 distortedUv = vUv;
      distortedUv.x += sin(vUv.y * 10.0) * 0.02 * uScrollIntensity;

      // Sample current and next textures based on UV coordinates
      if (vUv.y < normalizedPosition) {
          gl_FragColor = texture2D(uNextTexture, distortedUv);
      } else {
          gl_FragColor = texture2D(uCurrentTexture, distortedUv);
      }
  }
`;
