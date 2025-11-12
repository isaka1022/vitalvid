/**
 * Shisa AI Translation Integration
 * https://talk.shisa.ai/ja
 */

export interface ShisaTranslationOptions {
  text: string;
  sourceLang?: string; // デフォルト: "ja" (日本語)
  targetLang?: string; // デフォルト: "en" (英語)
}

export interface ShisaTranslationResponse {
  success: boolean;
  translatedText?: string;
  error?: string;
  sourceLang?: string;
  targetLang?: string;
}

/**
 * Shisa AI Translation APIを使用してテキストを翻訳
 */
export async function translateWithShisa(
  options: ShisaTranslationOptions
): Promise<ShisaTranslationResponse> {
  const apiKey = process.env.SHISA_API_KEY;

  if (!apiKey) {
    console.warn("SHISA_API_KEY が設定されていません。翻訳機能はスキップされます。");
    return {
      success: false,
      error: "SHISA_API_KEY not configured",
    };
  }

  try {
    const { text, sourceLang = "ja", targetLang = "en" } = options;

    // Shisa AI Translation APIエンドポイント
    const apiUrl = "https://api.shisa.ai/v1/translate";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shisa Translation API Error:", errorText);
      return {
        success: false,
        error: `Translation API error: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      translatedText: result.translated_text || result.text,
      sourceLang,
      targetLang,
    };
  } catch (error: any) {
    console.error("Shisa Translation error:", error);
    return {
      success: false,
      error: error.message || "Unknown translation error",
    };
  }
}

/**
 * 日本語→英語の翻訳（ヘルパー関数）
 */
export async function translateJaToEn(
  text: string
): Promise<ShisaTranslationResponse> {
  return translateWithShisa({
    text,
    sourceLang: "ja",
    targetLang: "en",
  });
}

/**
 * 英語→日本語の翻訳（ヘルパー関数）
 */
export async function translateEnToJa(
  text: string
): Promise<ShisaTranslationResponse> {
  return translateWithShisa({
    text,
    sourceLang: "en",
    targetLang: "ja",
  });
}

/**
 * 複数テキストの一括翻訳
 */
export async function translateMultiple(
  texts: string[],
  options?: Omit<ShisaTranslationOptions, "text">
): Promise<ShisaTranslationResponse[]> {
  const promises = texts.map((text) =>
    translateWithShisa({
      text,
      ...options,
    })
  );

  return Promise.all(promises);
}
