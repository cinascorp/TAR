# TAR: The Airline Reconstruction
## Introduction
Traditional air traffic visualization platforms are based on delayed
telemetry pipelines and server side rendering. TAR proposes a
distributed alternative inspired by Passive Coherent Location (PCL),
where the client browser acts as a sensor node. Beyond positional
decoding, TAR treats network transport characteristics as a measurable
signal. Variations in packet timing are hypothesized to encode
environmental disturbances caused by aerial objects interacting with
ambient electromagnetic fields.

## System Architecture

The TAR framework consists of three tightly coupled analytical domains:.
(1) Geodesic Layer: Accurate spatial reconstruction using the spherical
Earth approximation .
(2) Temporal Layer: Continuous trajectory
estimation via interpolation and filtering. 
(3) Signal Layer: Detection
of anomalies in packet timing interpreted as phase disturbances.

## Geodesic Modeling

The Aircraft distance is computed using the Haversine formulation:
$$ \begin{equation}
a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cos\phi_2 \sin^2\left(\frac{\Delta\lambda}{2}\right)
\end{equation}$$ $$\begin{equation}
c=2\cdot atan~2(\sqrt{a},\sqrt{1-a})
\end{equation}$$ $$\begin{equation}
d = R \cdot c
\end{equation}$$This provides a stable baseline for the spatial
correlation between telemetry and observation.

## Temporal Interpolation and Filtering

To mitigate packet discontinuities, TAR applies Linear Interpolation:
$$\begin{equation}
P_{t}=P_{start}+(P_{end}-P_{start})\cdot\frac{t-t_{last}}{\Delta t}
\end{equation}$$ Angular smoothing is handled via modular correction:
$$\begin{equation}
\Delta\theta=((\theta_{target}-\theta_{current}+540) \pmod{360}) - 180
\end{equation}$$ Additionally, a discrete Kalman filter is introduced to
stabilize the velocity and heading estimation under noisy input
conditions.

# Network-Layer Signal Analysis

Unlike conventional systems, TAR evaluates the packet timing as a signal
source.The Signal-to-noise ratio is defined as: $$\begin{equation}
SNR_{blob} = \frac{\Sigma B}{\sigma_{jitter}^2}
\end{equation}$$ where $\sigma_{jitter}^{2}$ represents the latency
variance. A latency delta function is defined as: $$\begin{equation}
\Delta\tau=T_{rx}-T_{tx}-\frac{d}{c}
\end{equation}$$ Under stable propagation, $\Delta\tau\rightarrow0$.
Deviations are interpreted as anomalies.

# Electromagnetic Shadow Hypothesis

Low-observable aerial objects reduce radar cross-section but cannot
fully eliminate interaction with ambient RF fields. TAR hypothesizes
that such interactions induce measurable disturbances in network-layer
timing. An anomaly condition is defined as: $$\begin{equation}
\lim_{\Delta t\rightarrow0}\Delta\tau\approx0\wedge|B|>\theta
\end{equation}$$ where B is the threshold of the blob.

# Observational Results

Field observations indicate that GPU-rendered trajectories, enhanced by
predictive interpolation, can visually precede direct optical perception
under long-range conditions (10-14 km). This effect is attributed not to
faster-than-light propagation, but to:

- predictive smoothing of motion;

- reduced perceptual latency via near-eye display

- high refresh-rate GPU rendering

# Conclusion

TAR demonstrates that native browser architectures can extend beyond
visualization to signal interpretation. By combining geodesy, temporal
prediction, and network-phase analysis, the system introduces a novel
perspective on passive aerial detection. Future work includes validation
against controlled RF environments and integration with multi-node
correlation. github.com/cinascorp/TAR
