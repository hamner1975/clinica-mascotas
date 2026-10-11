<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Tokens JWT (HS256) sin dependencias externas.
 */
class Jwt
{
    public static function encode(array $payload, int $ttl = 604800): string
    {
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttl;

        $segments = [
            self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])),
            self::base64UrlEncode(json_encode($payload)),
        ];
        $signing = implode('.', $segments);
        $segments[] = self::base64UrlEncode(hash_hmac('sha256', $signing, self::secret(), true));

        return implode('.', $segments);
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        [$header, $payload, $signature] = $parts;

        $expected = self::base64UrlEncode(hash_hmac('sha256', "$header.$payload", self::secret(), true));
        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $data = json_decode(self::base64UrlDecode($payload), true);
        if (!is_array($data)) {
            return null;
        }
        if (isset($data['exp']) && (int) $data['exp'] < time()) {
            return null;
        }
        return $data;
    }

    private static function secret(): string
    {
        return (string) Env::get('JWT_SECRET', 'insecure-dev-secret');
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/')) ?: '';
    }
}
