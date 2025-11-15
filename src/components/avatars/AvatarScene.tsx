import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { FloatingAvatar, AvatarType } from './FloatingAvatar';
import { AvatarParticles } from './AvatarParticles';
import { Suspense } from 'react';

interface AvatarSceneProps {
  avatarType: AvatarType;
  showParticles?: boolean;
  enableControls?: boolean;
  className?: string;
}

export const AvatarScene = ({
  avatarType,
  showParticles = true,
  enableControls = false,
  className = '',
}: AvatarSceneProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
          />
          <pointLight position={[-5, 5, -5]} intensity={0.4} color="#8B5CF6" />
          <pointLight position={[5, -5, 5]} intensity={0.4} color="#3B82F6" />

          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[0, 1, 5]}
            fov={45}
          />

          {/* Avatar */}
          <FloatingAvatar type={avatarType} scale={1} />

          {/* Particles */}
          {showParticles && (
            <AvatarParticles
              count={30}
              color1="#8B5CF6"
              color2="#3B82F6"
            />
          )}

          {/* Optional controls for debugging */}
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
