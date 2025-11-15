import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export type AvatarType = 'TINO' | 'ZAHIA' | 'ROMA';

interface FloatingAvatarProps {
  type: AvatarType;
  scale?: number;
}

// Avatar configurations
const avatarConfig = {
  TINO: {
    // Athletic, dynamic pose - bright purple/blue
    primaryColor: '#8B5CF6',
    secondaryColor: '#3B82F6',
    tertiaryColor: '#10B981',
    pose: 'dynamic',
  },
  ZAHIA: {
    // Calm, balanced - teal/cyan
    primaryColor: '#10B981',
    secondaryColor: '#06B6D4',
    tertiaryColor: '#8B5CF6',
    pose: 'balanced',
  },
  ROMA: {
    // Thoughtful, focused - orange/pink
    primaryColor: '#F59E0B',
    secondaryColor: '#EC4899',
    tertiaryColor: '#3B82F6',
    pose: 'focused',
  },
};

export const FloatingAvatar = ({ type, scale = 1 }: FloatingAvatarProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport } = useThree();

  const config = avatarConfig[type];

  // Mouse move interaction
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Smooth rotation towards mouse
    const targetRotationY = mousePosition.x * 0.3;
    const targetRotationX = mousePosition.y * 0.2;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );

    // Gentle idle animation
    groupRef.current.position.y += Math.sin(time * 2) * 0.001;
  });

  // Handle mouse move
  const handlePointerMove = (event: any) => {
    if (!event.point) return;
    const x = (event.point.x / viewport.width) * 2;
    const y = (event.point.y / viewport.height) * 2;
    setMousePosition({ x, y });
  };

  // Render different poses based on avatar type
  const renderPose = () => {
    switch (config.pose) {
      case 'dynamic':
        // TINO - Athletic jumping pose
        return (
          <>
            {/* Head */}
            <mesh position={[0, 1.8, 0]}>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Body */}
            <mesh position={[0, 1, 0]} rotation={[0.1, 0, 0]}>
              <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
              <meshStandardMaterial color={config.secondaryColor} />
            </mesh>

            {/* Arms - raised dynamically */}
            <mesh position={[-0.5, 1.2, 0]} rotation={[0, 0, -0.5]}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>
            <mesh position={[0.5, 1.2, 0]} rotation={[0, 0, 0.5]}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Legs - jumping position */}
            <mesh position={[-0.2, 0.3, 0]} rotation={[0.3, 0, 0]}>
              <capsuleGeometry args={[0.15, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
            <mesh position={[0.2, 0.3, 0]} rotation={[-0.3, 0, 0]}>
              <capsuleGeometry args={[0.15, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
          </>
        );

      case 'balanced':
        // ZAHIA - Calm standing pose
        return (
          <>
            {/* Head */}
            <mesh position={[0, 1.7, 0]}>
              <sphereGeometry args={[0.38, 32, 32]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Body */}
            <mesh position={[0, 1, 0]}>
              <capsuleGeometry args={[0.33, 0.8, 16, 32]} />
              <meshStandardMaterial color={config.secondaryColor} />
            </mesh>

            {/* Arms - relaxed at sides */}
            <mesh position={[-0.45, 0.9, 0]} rotation={[0.2, 0, -0.1]}>
              <capsuleGeometry args={[0.11, 0.65, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>
            <mesh position={[0.45, 0.9, 0]} rotation={[0.2, 0, 0.1]}>
              <capsuleGeometry args={[0.11, 0.65, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Legs - standing */}
            <mesh position={[-0.15, 0.3, 0]}>
              <capsuleGeometry args={[0.14, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
            <mesh position={[0.15, 0.3, 0]}>
              <capsuleGeometry args={[0.14, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
          </>
        );

      case 'focused':
        // ROMA - Thinking pose
        return (
          <>
            {/* Head - slightly tilted */}
            <mesh position={[0, 1.75, 0]} rotation={[0, 0, 0.1]}>
              <sphereGeometry args={[0.39, 32, 32]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Body */}
            <mesh position={[0, 1, 0]} rotation={[-0.1, 0, 0]}>
              <capsuleGeometry args={[0.34, 0.8, 16, 32]} />
              <meshStandardMaterial color={config.secondaryColor} />
            </mesh>

            {/* Arms - one hand near face (thinking) */}
            <mesh position={[-0.3, 1.3, 0.2]} rotation={[-1, 0, -0.3]}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>
            <mesh position={[0.45, 0.9, 0]} rotation={[0.3, 0, 0.2]}>
              <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
              <meshStandardMaterial color={config.primaryColor} />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.15, 0.3, 0]}>
              <capsuleGeometry args={[0.14, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
            <mesh position={[0.15, 0.3, 0]}>
              <capsuleGeometry args={[0.14, 0.7, 8, 16]} />
              <meshStandardMaterial color={config.tertiaryColor} />
            </mesh>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[0, 0.2]}
    >
      <group
        ref={groupRef}
        scale={scale}
        onPointerMove={handlePointerMove}
      >
        {renderPose()}

        {/* Glow effect */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color={config.primaryColor}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
};
