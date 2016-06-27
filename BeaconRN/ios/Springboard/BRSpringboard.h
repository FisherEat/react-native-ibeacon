//
//  BRSpringboard.h
//  BeaconRN
//
//  Created by gaolong on 16/5/25.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "RCTRootView.h"

@interface BRSpringboard : NSObject<RCTBridgeModule>

+ (RCTRootView *)rctRootViewWithClassname:(NSString *)class;

@end
