# TAR: The Airline Reconstruction
# live demo : cinascorp.github.io/TAR/
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

The TAR framework consists of three tightly coupled analytical domains:
### (1) Geodesic Layer: 
Accurate spatial reconstruction using the spherical
Earth approximation .
### (2) Temporal Layer: 
Continuous trajectory estimation via interpolation and filtering. 
### (3) Signal Layer: 
Detection of anomalies in packet timing interpreted as phase disturbances.

## Geodesic Modeling

The Aircraft distance is computed using the Haversine formulation:

$$
a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cdot \cos\phi_2 \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)
$$

$$
c=2\cdot atan~2(\sqrt{a},\sqrt{1-a})
$$

$$
d = R \cdot c
$$

This provides a stable baseline for the spatial
correlation between telemetry and observation.

## Temporal Interpolation and Filtering

To mitigate packet discontinuities, TAR applies Linear Interpolation:

$$
P_{t}=P_{start}+(P_{end}-P_{start})\cdot\frac{t-t_{last}}{\Delta t}
$$

Angular smoothing is handled via modular correction:
$$
\Delta\theta=((\theta_{target}-\theta_{current}+540) \pmod{360}) - 180
$$

Additionally, a discrete Kalman filter is introduced to
stabilize the velocity and heading estimation under noisy input
conditions.

# Network-Layer Signal Analysis

Unlike conventional systems, TAR evaluates the packet timing as a signal
source.The Signal-to-noise ratio is defined as:

$$
SNR_{blob} = \frac{\Sigma |Bᵢ|^2}{\sigma_{jitter}^2}
$$ 

where 

$$
\sigma_{jitter}^{2}
$$

represents the latency
variance. A latency delta function is defined as:

$$
\Delta\tau=T_{rx}-T_{tx}-\frac{d}{c}
$$ 

Under stable propagation, 

$$
\Delta\tau\rightarrow0
$$

Deviations are interpreted as anomalies.

# Electromagnetic Shadow Hypothesis

Low-observable aerial objects reduce radar cross-section but cannot
fully eliminate interaction with ambient RF fields. TAR hypothesizes
that such interactions induce measurable disturbances in network-layer
timing. An anomaly condition is defined as: 

$$
\lim_{\Delta t\rightarrow0}\Delta\tau\approx0\wedge|B|>\theta
$$

where B is the threshold of the blob.

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
correlation.

## github.com/cinascorp/TAR
#####
## How to use : 
just open index.html with any modern browser like Google Chrome, Mozilla Firefox ,Safari , or etc ...
or download and setup apk file on Android OS .
best performance and feature are available while use window or linux internet browsers inside Developer Option (F12) - for understanding blob behavior you need to use specially open layer v.10.2.1 instead of olv10.11.0 (current)
## Persian/Farsi

# تار
## معماری بومی مرورگر برای بازسازی پیش بینانه فضای هوایی و تجسم پرواز در زمان واقعی

### تار  یک چارچوب مکان یابی منسجم غیرفعال (Passive Coherent Location - PCL) در مرورگرهای مدرن که از جریان های تله متری **HTTP/3 (QUIC)** برای تشخیص و تجسم هوایی در زمان واقعی استفاده می کند.

## ۱. مقدمه

پلتفرم های سنتی تجسم ترافیک هوایی عمدتاً بر خطوط لوله تله متری دارای تأخیر و رندرینگ سمت سرور (Server-side) استوار هستند. این سیستم ها صرفاً به موقعیت های رمزگشایی شده ADS-B متکی هستند.

تار (TAR) یک جایگزین توزیع شده را با الهام از مفهوم **مکان یابی منسجم غیرفعال (PCL)** ارائه می دهد، جایی که مرورگر کلاینت به عنوان یک گره حسگر عمل می کند. برخلاف رویکردهای مرسوم، تارا ویژگی های انتقال شبکه را به عنوان یک سیگنال قابل اندازه گیری در نظر می گیرد. فرضیه اصلی این است که تغییرات ظریف در زمان بندی بسته های داده (Packet-level micro-latency variations یا Jitter)، حاوی اطلاعات اختلالات محیطی ناشی از تعامل اجسام هوایی با میدان های الکترومغناطیسی محیط است. این تغییرات به عنوان یک «کانال سیگنال ثانویه» تحلیل می شوند که می توانند منجر به کشف اهدافی شوند که از دید رادارهای سنتی پنهان اند.

مشاهدات تجربی نشان می دهد که نمایش بصری ارائه شده توسط این معماری، در شرایط خاص، می تواند دارای «پیش تیمی زمانی زیرادراکی» (Sub-perceptual temporal lead) نسبت به مشاهده نوری مستقیم باشد. این معماری کاملاً در سمت کاربر (Client-side) و با استفاده از **WebGL** و **Web Workers** موازی عمل کرده و امکان تجسم مقیاس پذیر ترافیک هوایی متراکم را بدون نیاز به زیرساخت بک اند فراهم می سازد.

## ۲. معماری سیستم

چارچوب تارا از سه حوزه تحلیلی کاملاً به هم پیوسته تشکیل شده است:

1.  **لایه ژئودزیک (Geodesic Layer):** بازسازی دقیق مکانی با استفاده از تقریب زمین کروی.
2.  **لایه زمانی (Temporal Layer):** تخمین پیوسته مسیر با استفاده از درون یابی و فیلتر کردن.
3.  **لایه سیگنال (Signal Layer):** تشخیص ناهنجاری هایی در زمان بندی بسته ها که به عنوان اختلالات فاز تفسیر می شوند.

### ۲.۱. مدل سازی ژئودزیک (Haversine)

فاصله هواپیما با استفاده از فرمول هاورسین (Haversine) محاسبه می شود:

$$ a = \sin^2(\frac{\Delta\phi}{2}) + \cos(\phi_1) \cos(\phi_2) \cdot \sin^2(\frac{\Delta\lambda}{2}) $$
$$ c = 2 . atan2(\sqrt{a}, . \sqrt{1-a}) $$
$$ d = R . c $$

که در آن:
*   $\phi$ (فای): عرض جغرافیایی (به رادیان)
*   $\lambda$ (لامدا): طول جغرافیایی (به رادیان)
*   $R$: شعاع زمین (۶۳۷۱ کیلومتر)




### ۲.۲. درون یابی حرکت (الگوریتم هموارسازی)

برای حل مشکل لکنت (Stuttering) در داده های گسسته دریافتی از شبکه، از درون یابی خطی (Linear Interpolation - LERP) استفاده می شود:

$$ P(t) = P_{start} + (P_{end} - P_{start}) \times \frac{t - t_{last}}{\Delta t} $$

### ۲.۳. درون یابی جهت گیری (Heading Interpolation)

برای محاسبه میان بر کوتاه ترین مسیر در دوران چرخش (Modular Arithmetic):

$$ \Delta\theta = ((\theta_{target} - \theta_{current} + 540) \% 360) - 180 $$
$$ \theta(t) = \theta_{current} + \Delta\theta \times k_{smooth} $$

**پیاده سازی در جاوااسکریپت:**

```javascript
function lerpA(e, t, a) {
 return null == e
 ? (t ?? 0)
 : null == t
 ? (e ?? 0)
 : (e + (((t - e + 540) % 360) - 180) * a + 360) % 360;
}
```

## ۳. تئوری الکترومغناطیس و پردازش سیگنال

### ۳.۱. نسبت سیگنال به نویز (SNR)

یکپارچگی یک بلوک باینری ورودی ($B$) را می توان با آنتروپی رسیدن آن تعریف کرد. اگرچه این رابطه ممکن است در ریاضیات محض چالش برانگیز باشد، اما در پیاده سازی عملیاتی به صورت زیر مدل سازی شده است:

$$ SNR_{blob} = \frac{P_{signal}}{P_{noise}} = \frac{\sum |B[i]|^2}{\sigma^2_{jitter}} $$

که در آن:
*   $B[i]$: دامنه جریان بایت ها
*   $\sigma^2_{jitter}$: واریانس تأخیر بسته ها

**پیاده سازی تشخیص سایه (Anomaly Detection) با آنتروپی شانون:**

```javascript
class ShadowDetector {
  constructor(sensorId, historySize = 100) {
    this.sensorId = sensorId;
    this.signalHistory = new Array(historySize).fill(0);
    this.threshold = 0.85; // آستانه حساسیت
  }

  // به روزرسانی بافر سیگنال با قرائت های جدید
//--- Update signal buffer with new readings ---
  updateSignal(newVal) {
    this.signalHistory.shift();
    this.signalHistory.push(newVal);
  }

  // محاسبه توزیع احتمال
  calculateProbabilities(data) {
    const counts = {};
    data.forEach(x => {
      const bucket = Math.floor(x * 10);
 // گسسته سازی (Discretization)
      counts[bucket] = (counts[bucket] || 0) + 1;
    });
    const total = data.length;
    return Object.values(counts).map(c => c / total);
  }

  // محاسبه آنتروپی شانون: H(X) = - sum(p(x) * log2(p(x)))
//--- Shanon Entropy Calculation ---
  calculateEntropy() {
    const probs = this.calculateProbabilities(this.signalHistory);
    let entropy = 0;
    for (let p of probs) {
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    return entropy;
  }

  // منطق تشخیص هسته/هدف
//the logic of Core/Target Detection 
  detectObject() {
    const currentEntropy = this.calculateEntropy();
    
    // تحلیل منطقی: آنتروپی پایین به معنای سیگنال منظم (سایه) است
    // در میان نویز تصادفی یا انحراف قابل توجه از خط پایه
// Logical analysis: Low entropy means regular signal (shadow)
// amidst random noise or significant deviation from baseline

    const baselineEntropy = 3.5;
// خط پایه فرضی برای نویز سفید
\\--- Hypothetical baseline for white noise
    const deviation = Math.abs(currentEntropy - baselineEntropy);
    
    if (deviation > this.threshold) {
      return {
        detected: true,
        entropy: currentEntropy,
        timestamp: Date.now(),
        message: "ANOMALY DETECTED: EM Shadow Pattern"
      };
    }
    return { detected: false };
  }
}

// --- شبیه سازی حلقه سخت افزار ---
const processor = new ShadowDetector("Unit-Alpha-01");

// شبیه سازی جریان داده از خروجی ترانزیستور (مقادیر ADC از 0.0 تا 1.0)
setInterval(() => {
  // نویز تصادفی (آسمان معمولی)
  let signal = Math.random();
  
  // تزریق سایه مصنوعی (اثر افت سیگنال) به صورت دوره ای
  if (Date.now() % 5000 < 500) {
    signal = signal * 0.2; // اثر سایه: تضعیف سیگنال
  }
  
  processor.updateSignal(signal);
  const result = processor.detectObject();
  
  if (result.detected) {
    console.log(`[ALERT] Sensor ${processor.sensorId}:`, result);
    // ماژول محاسبه نقاط کروی را اینجا فراخوانی می کنیم
  }
}, 100);
```

### ۳.۲. تشخیص پنهانکاری (فرضیه هدف مهمنام/Ghost Target)

هواپیماهای کم بینا (Stealth) با حداقل رساندن مقطع راداری (Radar Cross Section - $\sigma_{rcs}$)، نمی توانند «سایه ای» که بر نویز پس زمینه RF ایجاد می کنند، کاملاً از بین ببرند. تارا این سایه ها را شناسایی می کند.

### ۳.۳. تابع دلتای تأخیر (Latency Delta Function)

تأخیر دلتای زمانی ($\Delta\tau$) از رابطه زیر بدست می آید:

$$ \Delta\tau = T_{rx} - T_{tx} - \left(\frac{d_{geodesic}}{c_{light}}\right) $$

### ۳.۴. شرایط ناهنجاری

در صورتی که شرایط زیر برقرار باشد:
$$ IF \left( \lim_{\Delta t \to 0} [\Delta\tau] \approx 0 \right) \land (Blob\_Mass > 1000 \text{ bytes}) $$
$$ THEN \rightarrow \text{Flag as Anomaly (Stealth Target)} $$

## ۴. منطق جبر بول و گیت های منطقی

موتور طبقه بندی تارا از یک آرایه گیت منطقی قطعی (Deterministic Logic Gate Array) استفاده می کند.
ورودی ها:
* $H$ (ارتفاع)، 
* $V$ (سرعت)، 
* $C$ (کد تماس/Callsign)، 
* $S$ (کد Squawk).
آستانه ها: 
* $H_{low} = 1200$ متر،
* $V_{slow} = 120$ کیلومتر/ساعت.

### ۴.۱. منطق شناسایی پهپاد (Gate D)
```
D = (H < H_{low}) ∧ (V < V_{slow}) ∧¬ ({Helicopter})
D = (H < 1200) ∧ (V < 120) ∧¬ ({Helicopter}) 

D = (H < H_{low}) AND (V < V_{slow}) AND NOT ({Helicopter})  
D = (H < 1200) AND (V < 120) AND NOT ({Helicopter}) 
```
### ۴.۲. منطق شناسایی پروازهای نظامی (Gate M)

```

M = (C { starts\_with } \{Military_prefix\}) ∨ (S == 7700) 
M = (C \in S_{mil}) ∨ (S == 7700)

M = (C { starts\_with } \{Military_prefix\}) OR (S == 7700) 
M = (C \in S_{mil}) OR (S == 7700)
```
## ۵. جمع بندی

سامانه **TAR** نوآوری ای در حوزه نظارت هوایی غیرفعال (Passive) است که با استفاده از مرورگر وب، شبکه ای توزیع شده برای ردیابی اجسام پرنده ایجاد می کند. این سیستم به جای اتکا به رادارهای سنتی، تغییرات ظریف در تأخیر بسته های داده (Jitter) را در پروتکل های مدرنی مانند HTTP/3 تحلیل کرده و آن ها را به عنوان سایه الکترومغناطیسی اجسام تفسیر می کند.

معماری این پروژه کاملاً سمت کاربر (Client-side) بوده و با بهره گیری از WebGL و فیلتر کالمن، موقعیت و مسیر پروازها را به صورت بلادرنگ پیش بینی و تجسم می سازد. از ویژگی های برجسته این فناوری، توانایی شناسایی اهداف رادارگریز و ریزپرنده ها بدون نیاز به زیرساخت های گران قیمت یا ارسال سیگنال های فعال است. در نهایت، تارا با تبدیل هر دستگاه متصل به اینترنت به یک گره حسگر، راهکاری مقیاس پذیر، پنهان و مقاوم در برابر جنگ الکترونیک ارائه می دهد.
