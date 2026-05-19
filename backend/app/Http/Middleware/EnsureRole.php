<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Middleware untuk memastikan user memiliki role yang sesuai.
     * Usage di route: ->middleware('role:parent,student')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi diperlukan.',
            ], 401);
        }

        $allowedRoles = array_map(fn($r) => $r, $roles);

        // User role bisa berupa Enum (jika di-cast) atau string
        $userRoleValue = $user->role instanceof UserRole ? $user->role->value : $user->role;

        if (!in_array($userRoleValue, $allowedRoles)) {
            $roleLabels = array_map(function ($r) {
                try {
                    return UserRole::from($r)->label();
                } catch (\ValueError) {
                    return $r;
                }
            }, $allowedRoles);

            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya ' . implode(' / ', $roleLabels) . ' yang dapat mengakses.',
            ], 403);
        }

        return $next($request);
    }
}
